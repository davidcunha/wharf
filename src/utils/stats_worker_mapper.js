'use strict';

module.exports = StatsWorkerMapper;

var StatsWorker = require('./stats_worker')
  , Container = require('../models/container')
  , DockerRemote = require('../services/docker_remote')
  , appConfig = require('../config/application');

/**
 * StatsWorkerMapper.
 * Manage Stats Workers: create, find, kill and load containers metrics.
 *
 * @constructor
 * @see {@link StatsWorker}.
 * @this {StatsWorkerMapper}
 * @return {StatsWorkerMapper} The Stats Worker Mapper
 */
function StatsWorkerMapper(cluster) {
  this.workersList = [];
  this.cluster = cluster;

  /**
   * In case the cluster mode is activated fork metrics workers
   */
  if(this.cluster) {
    loadContainersMetrics.call(this);
  }
}

/**
 * Creates a new stats worker for a container.
 *
 * @see {@link StatsWorker}
 * @this {StatsWorkerMapper}
 * @param {Object} worker - worker object created from cluster.fork operation
 * @param {Object} containerID - container ID used to associate container with a stats worker
 */
StatsWorkerMapper.prototype.create = function(worker, containerID) {
  worker = new StatsWorker({process: worker, entityName: containerID});
  this.workersList.push(worker);
};

/**
 * Finds a stats worker for a container.
 *
 * @see {@link StatsWorker}
 * @this {StatsWorkerMapper}
 * @param {Object} workerAttrs - attributes to find a stats worker
 * @return {Object} A stats worker object
 */
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

/**
 * Finds all stats workers.
 *
 * @see {@link StatsWorker}
 * @this {StatsWorkerMapper}
 * @return {Array} Stats workers objects
 */
StatsWorkerMapper.prototype.findAll = function() {
  return this.workersList;
};

/**
 * Kills a stats worker for a container.
 *
 * @see {@link StatsWorker}
 * @this {StatsWorkerMapper}
 * @param {Object} workerAttrs - attributes to kill a stats worker
 * @return {Boolean|undefined} kill operation success or undefined in case of insucess
 */
StatsWorkerMapper.prototype.kill = function(workerAttrs) {
  var worker = this.find(workerAttrs);
  if(worker) {
    clearInterval(worker.interval);
    this.workersList.splice(worker, 1);
    return true;
  }
};

/**
* Load containers metrics.
* Fetch all containers from Docker and refresh database.
* For each existing container fork a new worker used to gather stats metrics.
*
* @private
* @see {@link StatsWorker}.
* @this {StatsWorkerMapper}
* @return {Promise} A promise to the loadContainersMetrics result
*/
var loadContainersMetrics = function() {
  var self = this;
  DockerRemote.containers().then(function(containers) {
    return Container().updateContainersList(containers);
  }).then(function(containers) {
    return containers.forEach(function(container) {
      var worker = spawnWorker.call(self);
      self.create(worker, container.Id);
    });
  }).catch(function(err){
    appConfig.logger.error(err.stack);
  });
};

/**
* Spawn a new process for a stats worker.
*
* @private
* @this {StatsWorkerMapper}
* @return {Object} A new forked process
*/
var spawnWorker = function() {
  return this.cluster.fork();
};
