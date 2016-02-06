'use strict';

var winston = require('winston');
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true
    })
  ],
  exitOnError: false
});

var Config = {
  database: 'development',
  logger: logger
};

module.exports = Config;
