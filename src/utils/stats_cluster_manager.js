'use strict';

var cluster = require('cluster')
  , StatsWorkerMapper = require('./stats_worker_mapper');

var StatsClusterManager = function() {};

StatsClusterManager.prototype.start = function(options) {
  options = options || {};

  if (cluster.isMaster) {
    new StatsWorkerMapper(cluster);
  }

  return this;
};

module.exports = (function() {
  var instance;
  function createInstance() {
    var statsClusterManager = new StatsClusterManager();
    return statsClusterManager;
  }

  function getInstance() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  }

  return getInstance();
})();
