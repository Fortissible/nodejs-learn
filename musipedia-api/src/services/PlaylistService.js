const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../exceptions/InvariantError");

class PlaylistService {
  constructor(){
    this._pool = new Pool();
  }

  async addPlaylist(authId, {name}) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist VALUES($1, $2, $3) RETURNING id",
      values: [id, name, authId]
    };

    const {rows} = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError("Gagal menambahkan playlist");
    }

    return rows[0].id;
  }

  async getPlaylist(user_id) {
    const query = {
      text : `select * from playlist where owner = $1`,
      values : [user_id]
    };

    const {rows} = await this._pool.query(query);
    return rows
  }
}

module.exports = PlaylistService;