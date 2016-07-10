'use strict';

const winston = require('winston');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true,
      json: true
    })
  ],
  exitOnError: false
});

const config = {
  database: 'test',
  workerInterval: 10000,
  port: 3000,
  logger: logger
};

export default config;
