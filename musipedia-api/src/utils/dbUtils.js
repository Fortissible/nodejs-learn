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

module.exports = {
  albumDbToModel
};