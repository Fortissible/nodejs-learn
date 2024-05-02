const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistService {
  constructor(){
    this._pool = new Pool();
  }

  async verifyPlaylistInDbAndPlaylistOwner(playlistId, userId){
    const query = {
      text: `select * from playlist where id = $1`,
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak punya akses playlist ini');
    }
  }

  async addPlaylist(authId, name) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist VALUES($1, $2, $3) RETURNING id',
      values: [id, name, authId]
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
        throw new Error("Failed to add playlist"); // Change to more generic error
    }

    return rows[0].id;
  }

  async addPlaylistSong(playlist_id, song_id){
    const id = `junc-${nanoid(16)}`;
    const query = {
      text: `INSERT INTO junction_songs_playlist VALUES($1, $2, $3) RETURNING id`,
      values: [id, song_id, playlist_id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new InvariantError("Gagal menambahkan lagu kedalam playlist!");
    }
  }

  async getPlaylist(user_id) {
    const query = {
      text : `select playlist.id, playlist.name, users.username from playlist full join users on playlist.owner=users.id where playlist.owner = $1`,
      values : [user_id]
    };

    const {rows} = await this._pool.query(query);
    return rows;
  }

  async getPlaylistById(id){
    const query = {
      text: `select playlist.id, playlist.name, users.username from playlist full join users on playlist.owner=users.id where playlist.id = $1`,
      values: [id]
    };

    try {
      const result = await this._pool.query(query);

      if (!result.rows.length){
        throw new NotFoundError("Playlist tidak ditemukan");
      }

      const querySongs = {
        text: `select * from junction_songs_playlist full join songs on 
        junction_songs_playlist.song_id=songs.id where junction_songs_playlist.playlist_id = $1`,
        values: [result.rows[0].id]
      };

      const resultSongs = await this._pool.query(querySongs);

      const responseResult = result.rows[0];

      const songsResponseList = resultSongs.rows.map((payload) => ({
        id: payload.id,
        title: payload.title,
        performer: payload.performer
      }));
      
      responseResult.songs = songsResponseList;

      return responseResult;
    } catch (e) {
      console.log(e);
    }
  }

  async deletePlaylist(id){
    const query = {
      text: `delete from playlist where id = $1 returning id`,
      values: [id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
  }

  async deletePlaylistSong(playlist_id, song_id){
    const query = {
      text: `delete from junction_songs_playlist where song_id = $1 and playlist_id = $2 returning id`,
      values: [song_id, playlist_id]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal menghapus lagu. Album/lagu tidak ditemukan");
    }
  }
}

module.exports = PlaylistService;