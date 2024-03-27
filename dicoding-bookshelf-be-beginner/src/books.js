const bookList = [];
const { nanoid } = require('nanoid');

class Book {
  constructor(name, year, author, summary, publisher, pageCount, readPage, reading) {
    this._id = nanoid(16);
    this._finished = pageCount == readPage ? true : false;
    this._insertedAt = new Date().toISOString();
    this._updatedAt = this.insertedAt;
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.reading = reading;
  }

  get insertedAt(){
    return this._insertedAt;
  }
 
  get id() {
    return this._id;
  }
 
  // Methods
  updateBooks(name, year, author, summary, publisher, pageCount, readPage, reading) {
    var newUpdatedDate = new Date().toISOString();
    this._finished = pageCount == readPage ? true : false;
    this._updatedAt = newUpdatedDate;
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.reading = reading;
  }
}

module.exports = {bookList, Book};