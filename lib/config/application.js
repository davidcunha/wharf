'use strict';

var Config;

if(process.env.APP_ENV === 'test')
  Config = require('config/environments/test');
else
  Config = require('config/environments/development');

module.exports = Config;
