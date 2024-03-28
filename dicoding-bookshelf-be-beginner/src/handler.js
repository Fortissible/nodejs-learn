
let {Book, bookList} = require("./books");
const {filterByName, filterByRead, filterByFinished} = require("./utils");

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

  const isBookNameValid = name != undefined ? true : false; 
  const isPageValid = readPage > pageCount ? false : true; 

  if (isBookNameValid && isPageValid){

    const newBookId = newBook.id;
    bookList.push(newBook);
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
  
  let bookResult = bookList;
  let queries= request.query;

  if (queries.name){
    bookResult = filterByName(queries.name, bookResult);
  }

  if (queries.reading != undefined){
    bookResult = filterByRead(queries.reading, bookResult);
  }

  if (queries.finished != undefined){
    bookResult = filterByFinished(queries.finished, bookResult);
  }

  let responseResult = bookResult.map((book)=>{
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher
    }
  });

  console.log(responseResult);

  const response = h.response({
    status : 'success',
    data : {
      books: responseResult
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