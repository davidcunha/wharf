'use strict';

var winston = require('winston');
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true
    }),
    new (winston.transports.File)({ filename: 'logs/development.log' })
  ],
  exitOnError: false
});

var Config = {
  database: 'development',
  logger: logger
};

module.exports = Config;
