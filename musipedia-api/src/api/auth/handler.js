const autoBind = require("auto-bind");

class AuthHandler {
  constructor(authService, usersService, tokenManager, validator){
    this._authService = authService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationsHandler(request, h) {
    await this._validator.validateAuth(request.payload);

    const {username, password} = request.payload;

    // verify account creds in DB
    const id = await this._usersService.verifyCredential(username, password);

    // generate JWT
    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    // save refresh token to DB
    await this._authService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Autentikasi berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationsHandler(request, h) {
    await this._validator.validateToken(request.payload);

    const { refreshToken } = request.payload;

    // verify refresh token in DB
    await this._authService.verifyRefreshToken(refreshToken);

    // verify refresh token in Token Manager
    const {id: userId} = await this._tokenManager.verifyRefreshToken(refreshToken);

    // generate refresh JWT
    const accessToken = this._tokenManager.generateAccessToken({ userId });

    const response = h.response({
      status: 'success',
      message: 'Token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationsHandler(request, h) {
    await this._validator.validateToken(request.payload);

    const { refreshToken } = request.payload;

    // verify refresh token in DB
    await this._authService.verifyRefreshToken(refreshToken);

    // verify refresh token in Token Manager
    await this._tokenManager.verifyRefreshToken(refreshToken);

    // generate refresh JWT
    await this._authService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Autentikasi berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthHandler;