require('dotenv').config();
const Hapi = require('@hapi/hapi');
const ClientError = require('./exceptions/ClientError');
const AlbumsValidator = require('./validator/albums');
const AlbumService = require('./services/AlbumService');
const albums = require('./api/albums');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.host,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

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

  const albumService = new AlbumService();
  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: AlbumsValidator
    }
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();

