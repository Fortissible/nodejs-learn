/* eslint-disable linebreak-style */

// ERR HANDLING USING NORMAL METHOD (NON EXTENSION FUNCTION METHOD)
// const ClientError = require('../../exceptions/ClientError');

/* eslint-disable no-underscore-dangle */
class NoteHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // FIX BINDS OPERATOR BUGS
    // article about this binds operator on JS ECMAScripts
    // https://www.smashingmagazine.com/2018/10/taming-this-javascript-bind-operator/
    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(request, h) {
    const { title = 'untitled', body, tags } = request.payload;
    this._validator.validateNotePayload(request.payload);
    const noteId = this._service.addNote({ title, body, tags });

    const response = h.response({
      status: 'success',
      message: 'catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
    // ERR HANDLING USING NORMAL METHOD (NON EXTENSION FUNCTION METHOD)
    // try {
    //   this._validator.validateNotePayload(request.payload);
    //   const noteId = this._service.addNote({ title, body, tags });

    //   const response = h.response({
    //     status: 'success',
    //     message: 'catatan berhasil ditambahkan',
    //     data: {
    //       noteId,
    //     },
    //   });
    //   response.code(201);
    //   return response;
    // } catch (e) {
    //   if (e instanceof ClientError) {
    //     const response = h.response({
    //       status: 'fail',
    //       message: e.message,
    //     });
    //     response.code(e.statusCode);
    //     return response;
    //   }

    //   // Server ERROR!
    //   const response = h.response({
    //     status: 'error',
    //     message: 'Maaf, terjadi kegagalan pada server kami.',
    //   });
    //   response.code(500);
    //   console.error(e);
    //   return response;
    // }
  }

  getNotesHandler(request, h) {
    const notes = this._service.getNotes();
    const response = h.response({
      status: 'success',
      data: {
        notes,
      },
    });
    response.code(201);
    return response;
  }

  getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const note = this._service.getNoteById(id);
    const response = h.response({
      status: 'success',
      message: 'catatan berhasil ditambahkan',
      data: {
        note,
      },
    });
    response.code(201);
    return response;
    // ERR HANDLING USING NORMAL METHOD (NON EXTENSION FUNCTION METHOD)
    // try {
    //   const note = this._service.getNoteById(id);
    //   const response = h.response({
    //     status: 'success',
    //     message: 'catatan berhasil ditambahkan',
    //     data: {
    //       note,
    //     },
    //   });
    //   response.code(201);
    //   return response;
    // } catch (e) {
    //   if (e instanceof ClientError) {
    //     const response = h.response({
    //       status: 'fail',
    //       message: e.message,
    //     });
    //     response.code(e.statusCode);
    //     return response;
    //   }

    //   // Server ERROR!
    //   const response = h.response({
    //     status: 'error',
    //     message: 'Maaf, terjadi kegagalan pada server kami.',
    //   });
    //   response.code(500);
    //   console.error(e);
    //   return response;
    // }
  }

  putNoteByIdHandler(request, h) {
    const { id } = request.params;
    this._validator.validateNotePayload(request.payload);
    this._service.editNoteById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(201);
    return response;
    // ERR HANDLING USING NORMAL METHOD (NON EXTENSION FUNCTION METHOD)
    // try {
    //   this._validator.validateNotePayload(request.payload);
    //   this._service.editNoteById(id, request.payload);
    //   const response = h.response({
    //     status: 'success',
    //     message: 'Catatan berhasil diperbarui',
    //   });
    //   response.code(201);
    //   return response;
    // } catch (e) {
    //   if (e instanceof ClientError) {
    //     const response = h.response({
    //       status: 'fail',
    //       message: e.message,
    //     });
    //     response.code(e.statusCode);
    //     return response;
    //   }

    //   // Server ERROR!
    //   const response = h.response({
    //     status: 'error',
    //     message: 'Maaf, terjadi kegagalan pada server kami.',
    //   });
    //   response.code(500);
    //   console.error(e);
    //   return response;
    // }
  }

  deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    this._service.deleteNoteById(id);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(201);
    return response;
    // ERR HANDLING USING NORMAL METHOD (NON EXTENSION FUNCTION METHOD)
    // try {
    //   this._service.deleteNoteById(id);
    //   const response = h.response({
    //     status: 'success',
    //     message: 'Catatan berhasil dihapus',
    //   });
    //   response.code(201);
    //   return response;
    // } catch (e) {
    //   if (e instanceof ClientError) {
    //     const response = h.response({
    //       status: 'fail',
    //       message: e.message,
    //     });
    //     response.code(e.statusCode);
    //     return response;
    //   }

    //   // Server ERROR!
    //   const response = h.response({
    //     status: 'error',
    //     message: 'Maaf, terjadi kegagalan pada server kami.',
    //   });
    //   response.code(500);
    //   console.error(e);
    //   return response;
    // }
  }
}

module.exports = NoteHandler;