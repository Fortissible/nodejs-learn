const InvariantError = require("../../exceptions/InvariantError");
const usersSchema = require("./schema")

const usersValidator = {
  validateUsers: (payload) => {
    const result = usersSchema.validate(payload);
    if(result.error){
      throw new InvariantError(result.error.message);
    }
  }
}

module.exports = usersValidator;