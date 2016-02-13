'use strict';

var cluster = require('cluster')
  , StatsWorkerMapper = require('models/stats_worker_mapper');

var ClusterManager = function() {};

ClusterManager.prototype.start = function(options) {
  options = options || {};

  if (cluster.isMaster) {
    new StatsWorkerMapper(cluster);
  } else {
    require('controllers/containers_controller');
  }

  return this;
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
