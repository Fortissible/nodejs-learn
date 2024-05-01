const InvariantError = require("../../exceptions/InvariantError");
const { playlistSchema, playlistSongSchema } = require("./schema")

const playlistValidator = {
  validatePlaylist: (payload) => {
    const result = playlistSchema.validate(payload);

    if (result.error){
      throw new InvariantError(result.error.message);
    }
  },
  validatePlaylistSong: (payload) => {
    const result = playlistSongSchema.validate(payload);

    if (result.error){
      throw new InvariantError(result.error.message);
    }
  }
};

module.exports = playlistValidator;