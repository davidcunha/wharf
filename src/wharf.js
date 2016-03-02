'use strict';

var ClusterManager = require('./utils/cluster_manager');
require('./controllers/containers_controller');

module.exports = ClusterManager.start();
