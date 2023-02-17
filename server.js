require('colors');
const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/db')();
require('./startup/prod')(app);

const port = process.env.PORT || 2023;
const env = process.env.NODE_ENV || 'development';

const server = app.listen(port, () => winston.info(`Listening on port ${port} in ${env} mode...`.yellow.underline.bold));

module.exports = server;
