const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postAlbumLikeHandler,
      options: {
        auth: 'musipedia_jwt',
      },
    },
    {
      method: "DELETE",
      path: '/albums/{id}/likes',
      handler: handler.removeAlbumLikeHandler,
      options: {
        auth: 'musipedia_jwt',
      },
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getAlbumLikesHandler,
    },
  ];
  
  module.exports = routes;