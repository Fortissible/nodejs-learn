const bookList = [];
const { nanoid } = require('nanoid');

class Book {
  constructor(name, year, author, summary, publisher, pageCount, readPage, reading) {
    this.id = nanoid(16);
    this.finished = pageCount == readPage ? true : false;
    this.insertedAt = new Date().toISOString();
    this.updatedAt = this.insertedAt;
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.reading = reading;
  }
 
  // Methods
  updateBooks(name, year, author, summary, publisher, pageCount, readPage, reading) {
    var newUpdatedDate = new Date().toISOString();
    this.finished = pageCount == readPage ? true : false;
    this.updatedAt = newUpdatedDate;
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