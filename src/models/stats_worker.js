'use strict';

module.exports = StatsWorker;

var MemoryStats = require('./memory_stats')
  , DockerRemote = require('../services/docker_remote')
  , appConfig = require('../config/application')
  , moment = require('moment');

/**
 * StatsWorker.
 * Responsible for gather metrics from a Docker container by running a job.
 *
 * @constructor
 * @this {StatsWorker}
 * @param {Object} options - worker attributes as entityName (Docker container ID), associated forked process
 * @return {StatsWorker} The Stats Worker
 * @throws {Error} Will throw an error if entityName is undefined
 * @throws {Error} Will throw an error if process is undefined
 */
function StatsWorker(options) {
  options = options || {};
  if(!options.entityName) { throw new Error('\'entityName\' is undefined'); }
  if(!options.process) { throw new Error('\'process\' is undefined'); }

  this.entityName = options.entityName;
  this.process = options.process;
  this.job = fetchJob;

  this.run();
}

/**
 * Runs a job each x seconds (configurable).
 * The job gathers metrics from a Docker container.
 *
 * @see {@link Config}
 * @this {StatsWorker}
 */
StatsWorker.prototype.run = function() {
  this.interval = setInterval(function() {
    this.job();
  }.bind(this), appConfig.workerInterval);
};

/**
* Fetch job to be ran by worker each x seconds (configurable).
*
* @private
* @this {StatsWorker}
* @return {Promise} A promise to the fetchJob result
*/
var fetchJob = function() {
  // TODO get stats for all metrics in one fetchJob

  var containerID = this.entityName;
  var timestampDay = moment.utc().format('YYYY-MM-DD');

  MemoryStats().find({container_name: containerID, timestamp_day: timestampDay}).then(function(memoryStatsFromDB) {
    if(memoryStatsFromDB === undefined || memoryStatsFromDB === null) {
      // create a new stats record since there is no entry for that container at this day
      return MemoryStats().create({container_name: containerID}).then(function() {
        return containerID;
      });
    } else {
      return containerID;
    }
  }).then(function(containerID) {
    return DockerRemote.stats(containerID).then(function(stats) {
      var memoryStatFromDocker = parseStats(stats, 'memory_stats');

      return MemoryStats().find({container_name: containerID}).then(function(memoryStatsFromDB) {
        return memoryStatsFromDB;
      }).then(function(memoryStatsFromDB) {
        var updatedMemoryStats = updateStatSample(memoryStatFromDocker, memoryStatsFromDB);

        return MemoryStats().update({container_name: containerID}, updatedMemoryStats, function(res) {
          return res;
        });
      });
    });
  }).catch(function(err) {
    appConfig.logger.error(err.stack);
  });
};

/**
* Update hour object from database with stat from Docker.
*
* @private
* @param {Object} statFromDocker - fresh stats from Docker
* @param {Object} statsFromDB - stats from database to be updated
* @return {Object} Updated stats to be persisted in database
*/
function updateStatSample(statFromDocker, statsFromDB) {
  var hour = moment.utc().hour();
  var minute = moment.utc().minute();

  statsFromDB = statsFromDB['hour_' + hour].split(',');
  statsFromDB[minute] = statFromDocker;

  var updatedStats = {};
  updatedStats['hour_' + hour] = statsFromDB.join(',');
  return updatedStats;
}

// TODO parsing should be done in each stats model (memory, cpu, network, etc.)
function parseStats(stats, field) {
  return (stats[field].usage / 1024 / 1024).toFixed(1);
}
