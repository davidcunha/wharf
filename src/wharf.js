'use strict';

const express = require('express');
const path = require('path');
import appConfig from './config/application';
import BaseCtrl from './controllers/base_controller';

const app = express();
app.use(express.static(path.resolve(__dirname + '/public')));

const baseCtrl = BaseCtrl(app);
baseCtrl.registerCtrl('containers');

app.listen(appConfig.port);
appConfig.logger.info(`Listening on port ${appConfig.port}`);
