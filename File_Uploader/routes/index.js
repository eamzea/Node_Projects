const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uploadCloud = require('../config/uploader.js');
const Author = require('../models/Author');
const Book = require('../models/Book');
const User = require('../models/User');
const validateSession = require('../middlewares/session');

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/add', (req, res) => {
  res.render('add');
});

router.post('/add', uploadCloud.single('photo'), (req, res) => {
  res.render('img', {
    img: req.file.path,
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === '' || password === '') {
      throw new Error('Credentials cannot be empty');
    }

    const user = await User.findOne({ username });

    if (!user) {
      throw new Error('User not founded');
    }

    const validUser = await bcrypt.compare(password, user.password);

    if (!validUser) {
      throw new Error('Wrong password');
    }

    req.session.user = user;

    res.redirect('/books');
  } catch (error) {
    console.log(error);
    res.render('home', { errorLoginMessage: error });
  }
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const exist = await User.find({ username });

    if (exist.length > 0) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await new User({ username, password: hash });
    newUser.save();

    res.redirect('/books');
  } catch (error) {
    console.log(error);
    res.render('home', { errorRegisterMessage: error });
  }
});

router.get('/book/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    const author = await Author.findById(book.author);

    res.render('book', { book, author });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/books', validateSession, async (req, res) => {
  try {
    const books = await Book.find();

    res.render('books', { books });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/books/add', async (req, res) => {
  try {
    const authors = await Author.find();

    res.render('books-add', { authors });
  } catch (error) {
    console.log(error);
  }
});

router.post('/books/add', async (req, res) => {
  const { title, author, description, rating } = req.body;

  try {
    const newBook = new Book({ title, author, description, rating });

    newBook.save();

    console.log(newBook);

    res.redirect('/books');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }

  console.log(req.body);
  res.send('Sent');
});

router.get('/books/edit', async (req, res) => {
  const { book_id } = req.query;

  try {
    const book = await Book.findById(book_id);

    res.render('book-edit', { book });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/books/edit', async (req, res) => {
  const { book_id } = req.query;
  const { title, author, description, rating } = req.body;

  try {
    const book = await Book.findByIdAndUpdate(book_id, {
      title,
      author,
      description,
      rating,
    });

    res.redirect('/books');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/authors', async (req, res) => {
  try {
    const authors = await Author.find();

    res.render('authors', { authors });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.get('/authors/add', (req, res) => {
  res.render('author-add');
});

router.post('/authors/add', async (req, res) => {
  const { name, lastName, birthday, pictureUrl } = req.body;

  try {
    const newAuthor = new Author({ name, lastName, birthday, pictureUrl });

    newAuthor.save();

    res.redirect('/authors');
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.post('/reviews/add', async (req, res) => {
  const { book_id } = req.query;
  const { user, comments } = req.body;

  try {
    await Book.findByIdAndUpdate(book_id, {
      $push: { reviews: { user, comments } },
    });

    res.redirect(`/book/${book_id}`);
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/');
});

module.exports = router;
