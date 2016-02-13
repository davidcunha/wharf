'use strict';

module.exports = StatsWorkerMapper;

var StatsWorker = require('models/stats_worker')
  , Container = require('models/container')
  , DockerRemote = require('services/docker_remote')
  , appConfig = require('config/application');

function StatsWorkerMapper(cluster) {
  this.workersList = [];
  this.cluster = cluster;

  // if cluster mode is not activated, don't load workers for containers
  if(this.cluster) {
    reloadDockerContainersList.call(this);
  }
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

var reloadDockerContainersList = function() {
  var self = this;
  DockerRemote.containersIDs().then(function(containerIDs) {
    return Container().updateContainersList(containerIDs);
  }).then(function(containersIDs) {
    return containersIDs.forEach(function(containerID) {
      var worker = self.cluster.fork();
      self.create(worker, containerID);
    });
  }).catch(function(err){
    appConfig.logger.error(err.stack);
  });
};
