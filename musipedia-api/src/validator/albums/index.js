const InvariantError = require("../../exceptions/InvariantError");
const { AlbumsSchema } = require("./schema")

const AlbumsValidator = {
  validateAlbums: (payload) => {
    const result = AlbumsSchema.validate(payload);
    if (result.error){
      throw new InvariantError(result.error.message);
    }
  }
};

module.exports = AlbumsValidator;