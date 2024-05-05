const autoBind = require("auto-bind");

class AlbumHandler {
  constructor(service, storageService, validator){
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumCoversHandler(request, h){
    const { cover } = request.payload;
    const { id : albumId} = request.params;
    this._validator.validateAlbumCovers(cover.hapi.headers);
    const filename = await this._storageService.writeFile(albumId, cover, cover.hapi);
    const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/albums/${albumId}/cover/${filename}`;
    await this._service.updateAlbumCover(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: coverUrl,
      },
    });
    response.code(201);
    return response;
  }

  async postAlbumHandler(request, h){
    this._validator.validateAlbums(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({name, year});

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dibuat',
      data: {
        albumId
      }
    });

    response.code(201);
    return response;
  }

  async getAlbumsHandler(request, h) {
    const albums = await this._service.getAlbums();
    const response = h.response({
      status: 'success',
      data: {
        albums
      }
    });

    response.code(200);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    const response = h.response({
      status: 'success',
      data:{
        album
      }
    });

    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request, h){
    this._validator.validateAlbums(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil diupdate'
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h){
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus'
    });

    response.code(200);
    return response;
  }
}

module.exports = AlbumHandler;