const Joi = require("joi");

const authSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const tokenSchema = Joi.string().required();

module.exports = {
  authSchema,
  tokenSchema
}