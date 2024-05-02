const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'musipedia_jwt',
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: 'musipedia_jwt',
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'musipedia_jwt',
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: handler.getPlaylistByIdHandler,
    options: {
      auth: 'musipedia_jwt',
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: 'musipedia_jwt',
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: handler.deletePlaylistSongByIdHandler,
    options: {
      auth: 'musipedia_jwt',
    },
  },
];

module.exports = routes;