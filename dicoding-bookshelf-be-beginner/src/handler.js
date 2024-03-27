
let {Book, bookList} = require("./books");

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;
  let newBook = new Book(
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  );
  const newBookId = newBook.id;
  bookList.push(newBook);
  
  const isBookNameValid = name ? true : false; 
  const isPageValid = readPage > pageCount ? false : true; 

  if (isBookNameValid && isPageValid){
    const resp = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        "bookId": newBookId
      },
    });

    resp.code(201);
    return resp;
  } else {
    const resp = h.response({
      status: 'fail',
      message: !isPageValid 
        ? "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        : "Gagal menambahkan buku. Mohon isi nama buku"
    });

    resp.code(400);
    return resp;
  }
}

const getAllBooks = (request, h) => {
  const response = h.response({
    status : 'success',
    data : {
      books: bookList
    }
  })
  response.code(200);
  return response;
}

const getBookById = (request, h) => {
  const { bookId } = request.params;
  const book = bookList.filter((book) => book.id === bookId)[0];

  if (book !== undefined){
    const response = h.response({
      status: "success",
      data: {
        "book": book,
      }
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });

  response.code(404);
  return response;
}

const updateBook = (request, h) => {
  console.log(bookList);
  const {bookId} = request.params;

  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;

  const idx = bookList.findIndex((book) => book.id === bookId);

  if (idx !== -1) {
    const isBookNameValid = name ? true : false; 
    const isPageValid = readPage > pageCount ? false : true; 

    if (isBookNameValid && isPageValid){

      bookList[idx].updateBooks(
        name, year, author, summary, publisher,
        pageCount, readPage, reading,
      );

      const resp = h.response({
        status: 'success',
        message: "Buku berhasil diperbarui"
      });
      
      console.log("After Updating");
      console.log(bookList);
      resp.code(200);
      return resp;

    } else {

      const resp = h.response({
        status: 'fail',
        message: !isPageValid 
          ? "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
          : "Gagal memperbarui buku. Mohon isi nama buku"
      });

      resp.code(400);
      return resp;

    }
  }

  const response = h.response({
    status: 'fail',
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;

}

const deleteBook = (request, h) => {
  const {bookId} = request.params;

  const idx = bookList.findIndex((book) => book.id === bookId);

  if (idx !== -1){
    bookList.splice(idx,1);
    const response = h.response({
      status:"success",
      message: "Buku berhasil dihapus",
    })
    response.code(200);
    return response;
  }
  const response = h.response({
    status:"fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  })
  response.code(404);
  return response;
}

module.exports = {
  addBookHandler, 
  getAllBooks, 
  getBookById, 
  updateBook, 
  deleteBook,
}