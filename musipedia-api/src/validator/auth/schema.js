const Joi = require("joi");

const authSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const tokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

module.exports = {
  authSchema,
  tokenSchema
}