'use strict';

var MemoryStats = require('models/memory_stats')
  , DockerRemote = require('services/docker_remote')
  , appConfig = require('config/application')
  , moment = require('moment');

var StatsWorker = function(options) {
  options = options || {};
  if(!options.id) { throw new Error('\'id\' is undefined'); }
  if(!options.entityName) { throw new Error('\'entityName\' is undefined'); }
  if(!options.process) { throw new Error('\'process\' is undefined'); }

  this.id = options.id;
  this.entityName = options.entityName;
  this.process = options.process;
  this.job = fetchJob;
};

StatsWorker.prototype.run = function() {
  this.interval = setInterval(function() {
    this.job();
  }.bind(this), 5000);
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
        var updatedMemoryStats = setStatSample(memoryStatFromDocker, memoryStatsFromDB);

        return MemoryStats().update({container_name: containerID}, updatedMemoryStats, function(res) {
          return res;
        });
      });
    });
  }).catch(function(err) {
    appConfig.logger.error(err.stack);
  });
};

function setStatSample(statFromDocker, statsFromDB) {
  var hour = moment.utc().hour();
  var minute = moment.utc().minute();

  statsFromDB = statsFromDB['hour_' + hour].split(',');
  statsFromDB[minute] = statFromDocker;

  var updatedStats = {};
  updatedStats['hour_' + hour] = statsFromDB.join(',');
  return updatedStats;
}

function parseStats(stats, field) {
  return stats[field].usage;
}

module.exports = StatsWorker;
