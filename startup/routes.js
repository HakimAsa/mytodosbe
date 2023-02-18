const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

//relative paths
const todos = require('../routes/todos');
const { notFound, error } = require('../middleware/error');
const { glb } = require('../utils/Globals');
const { ep } = require('../utils/Endpoints');

module.exports = function (app) {
  //Body Parser
  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ extended: true, limit: '200mb' }));
  //Cookie Parser
  app.use(cookieParser());

  // Enable CORS
  app.use(cors());

  //Sanitize data
  app.use(mongoSanitize());

  // Secure headers
  app.use(helmet({ crossOriginEmbedderPolicy: false }));

  // Prevent XSS attacks
  app.use(xss());

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 min
    max: 50, // 50 requests can be made in 10 min
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  });
  app.use(limiter);

  // Prevent http param polution
  app.use(hpp());

  //   app.use(express.static(path.join(__dirname, '../public')));
  //   app.use('/api/uploads', express.static(path.join(__dirname, '../public/uploads')));
  //   app.use('/api/userImages', express.static('api/userImages')); //todo

  //entry point
  app.get('/', (req, res) => {
    res.json({ mytodoapp: 'is awesome' });
  });

  //favicon for fixing that request on prodcution
  app.get('/favicon.ico', (req, res) => {
    res.json({ myfavico: 'is coming soon...' });
  });

  app.use(glb.doSetForwardSlash(ep.API, ep.V1, ep.TODOS), todos);

  //global error middleware
  app.use(notFound);
  app.use(error);
};
