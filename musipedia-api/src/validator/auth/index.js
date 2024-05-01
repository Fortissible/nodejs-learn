const InvariantError = require("../../exceptions/InvariantError");
const { authSchema, tokenSchema } = require("./schema")

const authValidator = {
  validateAuth: (payload) => {
    const result = authSchema.validate(payload);
    if(result.error) {
      throw new InvariantError(result.error.message);
    }
  },
  validateToken: (payload) => {
    const result = tokenSchema.validate(payload);
    if(result.error) {
      throw new InvariantError(result.error.message);
    }
  }
}

module.exports = authValidator;