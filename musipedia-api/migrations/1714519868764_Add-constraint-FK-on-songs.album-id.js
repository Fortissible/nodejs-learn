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
  pgm.sql("INSERT INTO albums VALUES('replacement_album','replacement_album','2001','2024-04-28T08:08:21.479Z','2024-04-28T08:08:21.479Z')");
  pgm.sql("UPDATE songs SET album_id = 'replacement_album' WHERE album_id IS NULL");
  pgm.addConstraint('songs', 'fk_songs.albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) on DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.albums.id');
  pgm.sql("UPDATE songs SET album_id = NULL WHERE album_id = 'replacement_album'");
  pgm.sql("DELETE FROM albums WHERE id = 'replacement_album'");
};
