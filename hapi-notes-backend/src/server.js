/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
// mengimpor dotenv dan menjalankan konfigurasinya
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const NotesValidator = require('./validator/notes');
// NORMAL DEPENDENCY STYLE
// const routes = require('./routes');

// PLUGIN STYLE
const notes = require('./api/notes');
const ClientError = require('./exceptions/ClientError');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const { userValidator } = require('./validator/users');

// auth
const auth = require('./api/auth');
const AuthService = require('./services/postgres/AuthService');
const AuthenticationsValidator = require('./validator/auth');
const TokenManager = require('./tokenize/TokenManager');

// IN MEMORY DATA
// const NotesService = require('./services/inMemory/NotesService');

// DB DATA
const NotesService = require('./services/postgres/NotesService');

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();
  const authService = new AuthService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
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

  // PLUGIN STYLE
  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: userValidator,
      },
    },
    {
      plugin: auth,
      options: {
        authService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
