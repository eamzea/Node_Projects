const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const mongoose = require('mongoose');

/* GET home page */
router.get('/me', (req, res, next) => {
	User.findOne({ username: 'Pepito' }).populate({ path: 'reservations', populate: { path: 'book' } }).then((user) => {
		res.render('me', user);
	});
});

router.get('/', (req, res, next) => {
	Book.find().then((books) => {
		res.render('index', { books });
	});
});

router.get('/add-book', (req, res, next) => {
	res.render('add-book');
});

router.get('/reserve', (req, res, next) => {
	Book.find({ available: true }).then((books) => {
		res.render('reserve', { books });
	});
});

router.get('/return', (req, res, next) => {
	Book.find({ available: false }).then((books) => {
		res.render('reserve', { books });
	});
});

router.post('/add-book', (req, res, next) => {
	Book.create(req.body).then(() => {
		res.redirect('/');
	});
	console.log(req.body.books);
});

router.post('/reserve', (req, res, next) => {
	User.findOne({ username: 'Pepito' }).then((user) => {
		Promise.all([
			Book.findByIdAndUpdate(req.body.books, { available: false }),
			Reservation.create({ book: req.body.books, user: user._id }).then((reservation) => {
				user.reservations.push(reservation._id);
				return user.save();
			})
		]).then(() => {
			res.redirect('/');
		});
	});
});

router.post('/return', (req, res, next) => {
	User.findOne({ username: 'Pepito' }).then((user) => {
		Promise.all([
			Book.findByIdAndUpdate(req.body.books, { available: true }),
			Reservation.findOneAndUpdate(
				{
					book     : req.body.books,
					user     : user._id,
					returned : false
				},
				{ returned: true }
			)
		]).then(() => {
			res.redirect('/');
		});
	});
	console.log(req.body.books);
});

module.exports = router;
