const winston = require('winston');

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  winston.error(error.message, error);
  res.status(404);
  next(error);
};

const error = function (err, req, res, next) {
  // Log exception
  winston.error(err.message, err);

  // errors level
  // 1. error
  // 2. warn
  // 3. info
  // 4. verbose
  // 5. debug
  // 6. silly
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).send({
    success: false,
    code: err.code,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    errorMessage: 'Something failed... ' + err.message,
  });
  next();
};

module.exports = { error, notFound };
