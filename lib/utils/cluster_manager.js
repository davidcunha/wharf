'use strict';

var cluster = require('cluster')
  , StatsWorkerMapper = require('models/stats_worker_mapper')
  , appConfig = require('config/application');

var ClusterManager = function() {};

ClusterManager.prototype.start = function(options) {
  options = options || {};

  if (cluster.isMaster) {
    new StatsWorkerMapper(cluster);
  } else {
    var express = require('express');
    var app = express();

    app.listen(3000);
    appConfig.logger.info('Wharf listening on port 3000');
  }
};

module.exports = (function() {
  var instance;
  function createInstance() {
    var clusterManager = new ClusterManager();
    return clusterManager;
  }

  function getInstance() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  }

  return getInstance();
})();
