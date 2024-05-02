const autoBind = require("auto-bind");

class UsersHandler{
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    autoBind(this);
  };

  async postUsersHandler(request, h){
    this._validator.validateUsers(request.payload);

    // check username avalability
    await this._service.verifyUsername(request.payload.username);

    const userId = await this._service.addUser(request.payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  };
}

module.exports = UsersHandler;