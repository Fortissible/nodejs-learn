const autoBind = require("auto-bind");
const InvariantError = require("../../exceptions/InvariantError");

class AlbumLikesHandler {
    constructor(albumLikesService, albumService) {
      this._albumLikeService = albumLikesService;
      this._albumService = albumService;

      autoBind(this);
    }
  
    async postAlbumLikeHandler(request, h) {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;
    
      await this._albumService.getAlbumById(albumId);
      const isLiked = await this._albumLikeService.verifyAlbumLike(credentialId, albumId);
  
      if (!isLiked) {
        await this._albumLikeService.addLikeAlbum(credentialId, albumId);
      } else {
        throw new InvariantError("Kamu sudah like album ini!");
      }
  
      const response = h.response({
        status: 'success',
        message: 'Berhasil merubah status like albums',
      });
      response.code(201);
      return response;
    }

    async removeAlbumLikeHandler(request, h){
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;
    
      await this._albumService.getAlbumById(albumId);
      const isLiked = await this._albumLikeService.verifyAlbumLike(credentialId, albumId);
  
      if (isLiked) {
        await this._albumLikeService.removeLikeAlbum(credentialId, albumId);
      }
  
      const response = h.response({
        status: 'success',
        message: 'Berhasil remove like albums',
      });
      response.code(200);
      return response;
    }
  
    async getAlbumLikesHandler(request, h) {
      try {
        const { id } = request.params;
  
        await this._albumService.getAlbumById(id);
    
        const { likes, from } = await this._albumLikeService.getAlbumLikes(id);
    
        if (from === 'cache') {
          const response = h.response({
            status: 'success',
              data: {
                likes,
              },
          });
          response.code(200);
          response.header('X-Data-Source', from);
          return response;
        }
      
        const response = h.response({
          status: 'success',
          data: {
            likes,
          },
        });
        response.code(200);
        return response;
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  module.exports = AlbumLikesHandler;