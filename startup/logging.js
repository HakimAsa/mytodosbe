const winston = require('winston');
module.exports = function () {
  winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    defaultMeta: { service: 'user-service' },
    transports: [new winston.transports.File({ filename: 'error.log' })],
  });

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  } else {
    winston.add(new winston.transports.Console());
  }
};
