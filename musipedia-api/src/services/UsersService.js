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
    
    const passwordMatch = await bcrypt.compare(password, result.rows[0].password);

    if (!passwordMatch) {
      throw new AuthenticationError("Kredensial salah!");
    }

    return result.rows[0].id;
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
    await this.verifyUsername(username);

    const id = `users-${nanoid(16)}`;

    const hashPassword = await bcrypt.hash(password,10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $3) RETURNING id',
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