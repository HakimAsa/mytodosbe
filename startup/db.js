const colors = require('colors');
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
  const db = config.get('db');
  mongoose.set('strictQuery', false);
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // into for unique names
    })
    .then(() => winston.info(`Connected to ${db}...`.cyan.underline.bold))
    .catch((ex) => console.error(ex));
};
