/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('junction_songs_playlist',{
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
    }
  });

  pgm.addConstraint(
    'junction_songs_playlist',
    "fk_junction_songs_playlist.playlist.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE",
  );
  pgm.addConstraint(
    'junction_songs_playlist',
    "fk_junction_songs_playlist.songs.id",
    "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE",
  );

  pgm.addConstraint(
    'junction_songs_playlist',
    'unique song_id and playlist_id',
    'UNIQUE(song_id, playlist_id)'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('junction_songs_playlist');
};
