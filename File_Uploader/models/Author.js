const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  birthday: Date,
  pictureUrl: String,
  nationality: String,
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
