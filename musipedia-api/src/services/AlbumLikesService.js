const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");
const { nanoid } = require("nanoid");

class AlbumLikesServices {
    constructor(cacheService) {
      this._pool = new Pool();
      this._cacheService = cacheService;
    }
  
    async addLikeAlbum(userId, albumId) {
      const id = `album-likes-${nanoid(16)}`;
  
        const query = {
          text: 'INSERT INTO album_likes values ($1, $2, $3)',
          values: [id, userId, albumId],
        };
    
        const {rowCount} = await this._pool.query(query);
    
        if (!rowCount) {
          throw new InvariantError('Gagal menyukai album!');
        }
    
        await this._cacheService.remove(`album-likes:${albumId}`);
    }
  
    async removeLikeAlbum(userId, albumId) {
      const query = {
        text: 'DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
        values: [userId, albumId],
      };
  
      const {rowCount} = await this._pool.query(query);
  
      if (!rowCount) {
        throw new NotFoundError('Gagal menghapus like album!');
      }
  
      await this._cacheService.remove(`album-likes:${albumId}`);
    }
  
    async getAlbumLikes(albumId) {
      try {
        const result = await this._cacheService.get(`album-likes:${albumId}`);
        return {
          likes: JSON.parse(result),
          from: 'cache',
        };
      } catch {
        const query = {
          text: 'SELECT * FROM album_likes WHERE album_id = $1',
          values: [albumId],
        };
  
        const {rowCount} = await this._pool.query(query);
  
        await this._cacheService.set(`album-likes:${albumId}`, JSON.stringify(rowCount), 1800);
        return {
          likes: rowCount,
        };
      }
    }
  
    async verifyAlbumLike(userId, albumId) {
      const query = {
        text: 'SELECT * FROM album_likes WHERE user_id = $1 AND album_id = $2',
        values: [userId, albumId],
      };
  
      const {rowCount} = await this._pool.query(query);
  
      return rowCount;
    }
  }
  
  module.exports = AlbumLikesServices;