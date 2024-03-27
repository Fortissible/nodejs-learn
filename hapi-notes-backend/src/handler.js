/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  notes.push(newNote);
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    // Settings CORS manual : response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');
    // ATAU response.header('Access-Control-Allow-Origin', '*'); IZIN AKSES SEMUA ORIGIN
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  // response.header('Access-Control-Allow-Origin', '*');
  response.code(500);
  return response;
};

const getNotesHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      notes,
    },
  });
  response.code(201);
  return response;
};

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        note,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;

  const updatedAt = new Date().toUTCString();

  const idx = notes.findIndex((note) => note.id === id);

  if (idx !== -1) {
    notes[idx] = {
      ...notes[idx],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const idx = notes.findIndex((note) => note.id === id);
  if (idx !== -1) {
    notes.splice(idx, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
