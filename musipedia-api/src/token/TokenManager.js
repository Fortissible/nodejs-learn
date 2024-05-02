const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artf = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artf, process.env.REFRESH_TOKEN_KEY);
      const {payload} = artf.decoded;
      return payload;
    } catch (e) {
      throw new InvariantError('Refresh token invalid');
    }
  }
}

module.exports = TokenManager;