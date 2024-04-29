/* eslint-disable linebreak-style */
const AuthHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, {
    authService,
    usersService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthHandler(
      authService,
      usersService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
