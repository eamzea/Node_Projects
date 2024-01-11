require('dotenv').config();
global.chalk = require('chalk');
const Server = require('./models/server');

const server = new Server();

server.initialize();
