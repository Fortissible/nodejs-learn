const autoBind = require("auto-bind");

class PlaylistHandler {
  constructor(service, songService, validator){
    this._service = service;
    this._songService = songService;
    this._validator = validator;

    autoBind(this);
  }
  
  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylist(request.payload.name);
    const userId = request.auth.credentials.id;
    const { name } = request.payload;
    const playlistId = await this._service.addPlaylist(userId, name);
    const response = h.response({
      status: 'success',
      message: 'Berhasil membuat playlist',
      data: {
        playlistId: playlistId
      }
    });
    response.code(201);
    return response;
  }
  
  // verify playlist_id and verify song_id in service berfore add songs and delete songs in playlist;
  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSong(request.payload.songId);
    const { id: userId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
  
    // verify playlist owner and playlist id availability
    await this._service.verifyPlaylistInDbAndPlaylistOwner(playlistId,userId)

    // verify is there songs with given id 
    await this._songService.getSongById(songId);

    await this._service.addPlaylistSong(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu kedalam playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    
    const result = await this._service.getPlaylist(userId);

    const response = h.response({
      status: 'success',
      data: {
        playlists: result
      }
    });
    response.code(200);
    return response;
  }

  async getPlaylistByIdHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    await this._service.verifyPlaylistInDbAndPlaylistOwner(playlistId,userId);
    const result = await this._service.getPlaylistById(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        playlist: result
      }
    });
    response.code(200);
    return response;
  }

  async deletePlaylistByIdHandler(request, h) {
    const {id: userId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    await this._service.verifyPlaylistInDbAndPlaylistOwner(playlistId,userId);
    await this._service.deletePlaylist(playlistId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus playlist'
    });
    response.code(200);
    return response;
  }
  
  // verify playlist_id and verify song_id in service berfore add songs and delete songs in playlist;
  async deletePlaylistSongByIdHandler(request, h) {

    this._validator.validatePlaylistSong(request.payload.songId);

    const {id: userId} = request.auth.credentials;
    const {id: playlistId} = request.params;
    const {songId} = request.payload;

    // verify is there playlist with given id and verify owner
    await this._service.verifyPlaylistInDbAndPlaylistOwner(playlistId,userId);

    // verify is there songs with given id 
    await this._songService.getSongById(songId);

    await this._service.deletePlaylistSong(playlistId, songId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menghapus lagu didalam playlist'
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistHandler;