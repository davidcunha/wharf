'use strict';

var winston = require('winston')
  , fs = require('fs');

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
  logger: logger,
  schema: fs.readFileSync('lib/config/database/schema.sql', 'utf8')
};

module.exports = Config;
