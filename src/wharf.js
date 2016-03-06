'use strict';

var StatsClusterManager = require('./utils/stats_cluster_manager');
require('./controllers/containers_controller');

module.exports = StatsClusterManager.start();
