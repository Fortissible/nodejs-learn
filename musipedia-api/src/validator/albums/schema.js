const Joi = require('joi');

const AlbumsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().min(0).max(3000).required(),
});

const AlbumCoversSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml').required(),
}).unknown();

module.exports = {
  AlbumsSchema,
  AlbumCoversSchema
}