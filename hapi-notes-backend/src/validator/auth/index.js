/* eslint-disable linebreak-style */
const {
  PostAuthSchema,
  PutAuthSchema,
  DeleteAuthSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuth: (payload) => {
    const validationResult = PostAuthSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuth: (payload) => {
    const validationResult = PutAuthSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuth: (payload) => {
    const validationResult = DeleteAuthSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
