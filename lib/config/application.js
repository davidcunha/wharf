'use strict';

var Config;

if(process.env.APP_ENV === 'test')
  Config = require('./environments/test');
else
  Config = require('./environments/development');

module.exports = Config;
