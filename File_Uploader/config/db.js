const mongoose = require('mongoose');

const DB_NAME = 'library';

const DB = async () => {
  try {
    await mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = DB;
