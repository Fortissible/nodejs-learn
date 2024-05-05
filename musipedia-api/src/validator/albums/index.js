const InvariantError = require("../../exceptions/InvariantError");
const { AlbumsSchema, AlbumCoversSchema } = require("./schema")

const AlbumsValidator = {
  validateAlbums: (payload) => {
    const result = AlbumsSchema.validate(payload);
    if (result.error){
      throw new InvariantError(result.error.message);
    }
  },
  validateAlbumCovers: (headers) => {
    const validationResult = AlbumCoversSchema.validate(headers);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;