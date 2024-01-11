const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const mongoose = require('mongoose');

/* GET home page */
router.get('/:bookId/:otroParam', (req, res, next) => {
	console.log(req.params);
	Book.findById(req.params.bookId).then((book) => {
		res.render('book', book);
	});
});

module.exports = router;
