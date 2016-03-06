'use strict';

module.exports = StatsWorker;

var MemoryStats = require('./memory_stats')
  , DockerRemote = require('../services/docker_remote')
  , appConfig = require('../config/application')
  , moment = require('moment');

function StatsWorker(options) {
  options = options || {};
  if(!options.entityName) { throw new Error('\'entityName\' is undefined'); }
  if(!options.process) { throw new Error('\'process\' is undefined'); }

  this.entityName = options.entityName;
  this.process = options.process;
  this.job = fetchJob;

  this.run();
}

StatsWorker.prototype.run = function() {
  this.interval = setInterval(function() {
    this.job();
  }.bind(this), appConfig.workerInterval);
};

// TODO get stats for all metrics in one fetchJob
var fetchJob = function() {
  var containerID = this.entityName;
  var timestampDay = moment.utc().format('YYYY-MM-DD');

  MemoryStats().find({container_name: containerID, timestamp_day: timestampDay}).then(function(memoryStatsFromDB) {
    if(memoryStatsFromDB === undefined || memoryStatsFromDB === null) {
      // create a new stats record because there is no entry for that container at this day
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

function updateStatSample(statFromDocker, statsFromDB) {
  var hour = moment.utc().hour();
  var minute = moment.utc().minute();

  statsFromDB = statsFromDB['hour_' + hour].split(',');
  statsFromDB[minute] = statFromDocker;

  var updatedStats = {};
  updatedStats['hour_' + hour] = statsFromDB.join(',');
  return updatedStats;
}

// TODO parsing should be done in the memory stats model
function parseStats(stats, field) {
  return (stats[field].usage / 1024 / 1024).toFixed(1);
}
