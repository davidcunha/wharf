'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
import config from './config/application';
import BaseCtrl from './controllers/base_controller';

const app = express();

router.use(function(req, res, next) {
  config.logger.info(`Request: GET ${req.originalUrl} with ${JSON.stringify(req.params)}`);
  next();
});

app.use(express.static(path.resolve(__dirname + '/public')));
app.use(router);

const baseCtrl = BaseCtrl(router);
baseCtrl.registerCtrl('containers');

app.listen(config.port);
config.logger.info(`Listening on port ${config.port}`);
