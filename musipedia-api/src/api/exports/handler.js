const autoBind = require("auto-bind");

class ExportsHandler {
    constructor(service, playlistService, validator) {
        this._service = service;
        this._playlistService = playlistService;
        this._validator = validator;

        autoBind(this);
    }

    async postExportPlaylistHandler(request, h) {
        this._validator.validateExportPlaylist(request.payload);
        
        const {playlistId} = request.params;
        const userId = request.auth.credentials.id;
        await this._playlistService.verifyPlaylistInDbAndPlaylistOwner(playlistId, userId);

        const message = {
            targetEmail: request.payload.targetEmail,
            playlistId: playlistId,
        };

        await this._service.sendMessage('export:playlist', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;