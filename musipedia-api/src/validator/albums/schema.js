const Joi = require('joi');

const AlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().min(0).max(3000).required(),
});

module.exports = {
  AlbumsSchema
}