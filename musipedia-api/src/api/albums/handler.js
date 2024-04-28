class AlbumHandler {
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
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