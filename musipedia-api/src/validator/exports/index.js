const ExportPlaylistSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');
 
const ExportsValidator = {
  validateExportPlaylist: (payload) => {
    const validationResult = ExportPlaylistSchema.validate(payload);
 
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
 
module.exports = ExportsValidator;