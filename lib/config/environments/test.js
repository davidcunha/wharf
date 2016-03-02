'use strict';

var winston = require('winston');
var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true,
      json: true
    })
  ],
  exitOnError: false
});

var Config = {
  database: 'test',
  workerInterval: 10000,
  logger: logger
};

module.exports = Config;
