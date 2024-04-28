const autoBind = require('auto-bind');

class SongsHandler{
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    autoBind(this); // mem-bind nilai this untuk seluruh method sekaligus
  }

  async postSongHandler(request, h){
    this._validator.validateSongs(request.payload);

    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dibuat',
      data: {
        songId
      }
    });

    response.code(201);
    return response;
  }

  async getSongsHandler(request, h){
    const songs = await this._service.getSongs();
    const response = h.response({
      status: 'success',
      data: {
        songs
      }
    });

    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h){
    const {id} = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song
      }
    });

    response.code(200);
    return response;
  }

  async putSongByIdHandler(request ,h){
    this._validator.validateSongs(request.payload);
    const {id} = request.params;
    await this._service.editSongById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil diupdate',
    });

    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h){
    const {id} = request.params;

    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus'
    });

    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;