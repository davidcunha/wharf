'use strict';

var Config;

if(process.env.APP_ENV === 'development')
  Config = require('./environments/development');
else if(process.env.APP_ENV === 'test')
  Config = require('./environments/test');
else
Config = require('./environments/production');

module.exports = Config;
