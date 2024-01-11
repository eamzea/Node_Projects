require('dotenv').config();

const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const index = require('./routes/index');
const DB = require('./config/db');

DB();

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'basic',
    cookie: { maxAge: 1000 },
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/library' }),
  })
);

app.use('/', index);

app.listen(3000, () => console.log('Server running'));
