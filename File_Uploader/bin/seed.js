const mongoose = require('mongoose');
const Book = require('../models/Book');
const Author = require('../models/Author');
const books = require('../utils/books');

const DB_NAME = 'library';

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

Book.collection.drop();
Author.collection.drop();

const createAuthors = books.map(book => {
  const newAuthor = new Author(book.author);
  return newAuthor
    .save()
    .then(author => {
      return author.name;
    })
    .catch(error => {
      throw new Error(`Impossible to add the author. ${error}`);
    });
});

let findAuthors = Promise.all(createAuthors)
  .then(authors => {
    return books.map(book => {
      return Author.findOne({
        name: book.author.name,
        lastName: book.author.lastName,
      }).then(author => {
        if (!author) {
          throw new Error(
            `unknown author ${book.author.name} ${book.author.lastName}`
          );
        }
        return Object.assign({}, book, { author: author._id });
      });
    });
  })
  .catch(error => {
    throw new Error(error);
  });

const saveBooks = findAuthors
  .then(findAuthors => {
    return Promise.all(findAuthors).then(books => {
      return books.map(book => {
        const newBook = new Book(book);
        return newBook.save();
      });
    });
  })
  .then(savedBooks => {
    Promise.all(savedBooks)
      .then(books =>
        books.forEach(book => console.log(`created ${book.title}`))
      )
      .then(() => mongoose.connection.close())
      .catch(error => console.log('Error while saving the book: ', error));
  });
