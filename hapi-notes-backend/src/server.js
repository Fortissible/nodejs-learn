/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

const Hapi = require('@hapi/hapi');
const NotesValidator = require('./validator/notes');
// NORMAL DEPENDENCY STYLE
// const routes = require('./routes');

// PLUGIN STYLE
const notes = require('./api/notes');
const NotesService = require('./services/inMemory/NotesService');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: { // CORS pada semua routes
      cors: {
        origin: ['*'],
      },
    },
  });

  // EXTENSION FUNCTION ON PRERESPONSE LIFECYCLE FOR ERROR RESPONSE
  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    // penanganan client error secara internal.
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }
    return h.continue;
  });

  // NORMAL DEPENDENCY STYLE
  // server.route(routes);

  // PLUGIN STYLE
  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
