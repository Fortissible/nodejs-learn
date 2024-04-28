const albumDbToModel = ({
  id,
  name, 
  year,
  _,
  __
}) => (
  {
    id,
    name,
    year
  }
);

const albumDbToModelDetail = ({
  id,
  name, 
  year,
  _,
  __,
  songs
}) => (
  {
    id,
    name,
    year,
    songs
  }
);

const songDbToModelDetail = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  createdAt,
  updatedAt
}) => (
  {
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId : album_id,
  }
);

const songDbToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
  createdAt,
  updatedAt
}) => (
  {
    id,
    title,
    performer,
  }
);

module.exports = {
  albumDbToModel,
  songDbToModel,
  songDbToModelDetail,
  albumDbToModelDetail
};