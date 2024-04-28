const InvariantError = require("../../exceptions/InvariantError");
const { SongsSchema } = require("./schema")

const SongsValidator = {
  validateSongs: (payload) => {
    const result = SongsSchema.validate(payload);
    if(result.error){
      throw new InvariantError(result.error.message);
    }
  }
}

module.exports = SongsValidator;