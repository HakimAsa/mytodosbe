const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');

//relative paths
const todos = require('../routes/todos');
const { notFound, error } = require('../middleware/error');

const cors = require('cors');

module.exports = function (app) {
  app.use(cors());
  // Prevent XSS attacks
  // app.use(xss());

  //Sanitize data
  app.use(mongoSanitize());
  // secure headers
  app.use(helmet({ crossOriginEmbedderPolicy: false }));
  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ extended: true, limit: '200mb' }));

  app.use(cookieParser());
  //   app.use(express.static(path.join(__dirname, '../public')));
  //   app.use('/api/uploads', express.static(path.join(__dirname, '../public/uploads')));
  //   app.use('/api/userImages', express.static('api/userImages')); //todo

  //entry point
  app.get('/', (req, res) => {
    res.json({ mytodoapp: 'is awesome' });
  });

  app.use('/api/v1/todos', todos);

  //global error middleware
  app.use(notFound);
  app.use(error);
};
