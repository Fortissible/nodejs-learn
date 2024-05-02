require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const AlbumsValidator = require('./validator/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/SongService');
const SongsValidator = require('./validator/songs');

// Auth
const auth = require('./api/auth');
const AuthenticationsService = require('./services/AuthenticationsService');
const authValidator = require('./validator/auth');
const TokenManager = require('./token/TokenManager');

// Users
const users = require('./api/users');
const UsersService = require('./services/UsersService');
const userValidator = require('./validator/users');

// Playlist
const playlist = require('./api/playlist');
const PlaylistService = require('./services/PlaylistService');
const playlistValidator = require('./validator/playlist');

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

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('musipedia_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
  const songsService = new SongsService();
  const authService = new AuthenticationsService();
  const userService = new UsersService();
  const playlistService = new PlaylistService();
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },
    {
      plugin: auth,
      options: {
        authService: authService, 
        userService: userService, 
        tokenManager: TokenManager, 
        validator: authValidator
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService, 
        songsService: songsService, 
        validator: playlistValidator
      },
    },
    {
      plugin: users,
      options: {
        service: userService, 
        validator: userValidator
      },
    },
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();

