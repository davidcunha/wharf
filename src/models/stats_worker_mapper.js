'use strict';

module.exports = StatsWorkerMapper;

var StatsWorker = require('./stats_worker');
  // , Container = require('./container')
  // , DockerRemote = require('../services/docker_remote')
  // , appConfig = require('../config/application');

function StatsWorkerMapper(cluster) {
  this.workersList = [];
  this.cluster = cluster;

  /**
  * In case the cluster mode is activated fork metrics workers
  */
  // if(this.cluster) {
    // loadContainerMetrics.call(this);
  // }
}

StatsWorkerMapper.prototype.create = function(worker, containerID) {
  worker = new StatsWorker({process: worker, entityName: containerID});
  this.workersList.push(worker);
};

StatsWorkerMapper.prototype.find = function(workerAttrs) {
  workerAttrs = workerAttrs || {};
  if(Object.keys(workerAttrs).length === 0) { return; }

  // only looks for the first attribute
  var attr = Object.keys(workerAttrs)[0];

  return this.workersList.find(function(worker) {
    if(worker[attr] === workerAttrs[attr]) {
      return worker;
    }
  });
};

StatsWorkerMapper.prototype.findAll = function() {
  return this.workersList;
};

StatsWorkerMapper.prototype.kill = function(workerAttrs) {
  var worker = this.find(workerAttrs);
  if(worker) {
    clearInterval(worker.interval);
    this.workersList.splice(worker, 1);
    return true;
  }
};

// var loadContainerMetrics = function() {
//   var self = this;
//   DockerRemote.containers().then(function(containers) {
//     return Container().updateContainersList(containers);
//   }).then(function(containers) {
//     return containers.forEach(function(container) {
//       var worker = self.cluster.fork();
//       self.create(worker, container.Id);
//     });
//   }).catch(function(err){
//     appConfig.logger.error(err.stack);
//   });
// };
