const Joi = require("joi");

const SongsSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().min(0).max(3000).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().positive().optional(),
  albumId: Joi.string().optional(),
})

module.exports = {
  SongsSchema
};