/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const { userSchema } = require('./schema');

const userValidator = {
  validateUser: (payload) => {
    const validationResult = userSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = { userValidator };
