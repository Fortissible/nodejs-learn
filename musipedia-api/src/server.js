require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const ClientError = require('./exceptions/ClientError');

// Albums
const albums = require('./api/albums');
const AlbumService = require('./services/AlbumService');
const AlbumsValidator = require('./validator/albums');
const StorageService = require('./services/storage/StorageService');

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

// Exports
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Album Likes
const albumLikes = require('./api/albumLikes');
const AlbumLikesServices = require('./services/AlbumLikesService');
const CacheService = require('./services/redis_cache/CacheService');

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
    {
      plugin: Inert,
    }
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
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/cover'));
  const cacheService = new CacheService();
  const albumLikesService = new AlbumLikesServices(
    cacheService
  );

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumService,
        storageService: storageService,
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
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        playlistService: playlistService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        albumLikesService,
        albumService
      }
    }
  ]);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

init();

