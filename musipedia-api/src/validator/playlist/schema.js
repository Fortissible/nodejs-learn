const Joi = require("joi");

const playlistSchema = Joi.string().required();

const playlistSongSchema = Joi.string().required();

module.exports = {
  playlistSchema,
  playlistSongSchema
}