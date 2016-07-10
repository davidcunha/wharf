'use strict';

const winston = require('winston');
const fs = require('fs');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true,
      json: true
    })
    //,new (winston.transports.File)({ filename: 'logs/development.log' })
  ],
  exitOnError: false
});

const config = {
  database: 'development',
  workerInterval: 10000,
  logger: logger,
  port: 3000,
  schema: fs.readFileSync('src/config/database/schema.sql', 'utf8')
};

export default config;
