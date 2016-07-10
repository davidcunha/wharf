'use strict';

import devConfig from './environments/development';
import testConfig from './environments/test';
import prodConfig from './environments/production';

let config;

if(process.env.APP_ENV === 'development') {
  config = devConfig;
} else if(process.env.APP_ENV === 'test') {
  config = testConfig;
} else {
  config = prodConfig;
}

export default config;
