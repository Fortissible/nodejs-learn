const filterByName = (queryName, bookList) => {
  return bookList.filter(book => book.name.toLowerCase().includes(queryName.toLowerCase()));
}

const filterByRead = (readType, bookList) => {
  return bookList.filter(book => book.reading == readType);
}

const filterByFinished = (isFinished, bookList) => {
  return bookList.filter(book => book.finished == isFinished);
}

module.exports = {filterByName, filterByRead, filterByFinished};