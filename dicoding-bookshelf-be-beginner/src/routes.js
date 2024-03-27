const {
  addBookHandler, 
  getAllBooks, 
  getBookById, 
  updateBook, 
  deleteBook,
} = require("./handler");

const routes = [
  {
    method: "GET",
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: "POST",
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: '/books/{bookId}',
    handler: getBookById,
  },
  {
    method: "PUT",
    path: '/books/{bookId}',
    handler: updateBook
  },
  {
    method: "DELETE",
    path: '/books/{bookId}',
    handler: deleteBook
  },
]

module.exports = routes;