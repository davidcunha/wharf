'use strict';

var ContainersController = require('controllers/containers_controller')
  , Container = require('models/container');

var container = new Container();
container.find({id: 1});

module.exports = ContainersController;
