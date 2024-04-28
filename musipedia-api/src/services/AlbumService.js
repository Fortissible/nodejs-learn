const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('./../exceptions/InvariantError');
const { albumDbToModel, albumDbToModelDetail } = require('./../utils/dbUtils');
const NotFoundError = require('./../exceptions/NotFoundError');

class AlbumService {
  constructor(){
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt],
    }

    const result = await this._pool.query(query);

    if (!result){
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(albumDbToModel);
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [id]
    }

    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new NotFoundError('Album tidak ditemukan');
    } 

    const albumModel = result.rows.map(albumDbToModel)[0];
    const albumId = albumModel.id;
    
    const songsQuery = {
      text: 'SELECT * FROM songs WHERE album_id=$1',
      values: [albumId]
    }

    const songsResult = await this._pool.query(songsQuery);
    const albumDetailSongs = albumDbToModelDetail({
      ...albumModel, 
      songs: songsResult.rows
    });

    return albumDetailSongs;
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name=$1, year=$2, updated_at=$3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    }

    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new NotFoundError("Update gagal, id album tidak ditemukan.");
    }
  }

  async deleteAlbumById(id){
    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new NotFoundError("Delete gagal, id album tidak ditemukan.");
    }
  }
}

module.exports = AlbumService;