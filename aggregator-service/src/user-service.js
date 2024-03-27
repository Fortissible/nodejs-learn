const Hapi = require('@hapi/hapi');

const users = ['Aras', 'Arsy', 'Dimas', 'Ivan', 'Rafy', 'Gilang'];
const MISSING = 4;

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/{id}',
    handler: (request, h) => {
      const { id } = request.params;
      
      if (isNaN(id)) {
        return h.response().code(400);
      }

      const userId = parseInt(id);

      if (userId === MISSING) {
        return h.response().code(404);
      }

      
      return {
        id: userId,
        name: users[userId % users.length],
      };
    },
  });

  await server.start();
  console.log(`User service running on ${server.info.uri}`);
};

init();