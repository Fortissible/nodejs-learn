const { Pool } = require("pg");
const InvariantError = require('./../exceptions/InvariantError');
const AuthenticationError = require('./../exceptions/AuthenticationError');
const { nanoid } = require("nanoid");
const bcrypt = require('bcrypt');

class UsersService {
  constructor(){
    this._pool = new Pool();
  }

  async verifyCredential(username, password){
    const query = {
      text: "SELECT * FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new AuthenticationError("Kredensial salah!");
    }
    
    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial salah!");
    }

    return id;
  }

  async verifyUsername(username){
    const query = {
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    };

    const {rowCount} = await this._pool.query(query);

    if (rowCount > 0) {
      throw new InvariantError("Gagal daftar, user telah dipakai.");
    }
  }

  async addUser({username, password, fullname}) {
    const id = `users-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password,10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashPassword, fullname],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length){
      throw new InvariantError("Gagal mendaftarkan akun");
    }
    return result.rows[0].id;
  }
}

module.exports = UsersService;