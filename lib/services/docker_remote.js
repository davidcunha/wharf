'use strict';

var docker = require('docker-remote-api')
  , Q = require('q')
  , appConfig = require('config/application');

var DockerRemote = (function() {
  var request = docker();

  function containers() {
    return new Q.Promise(function(resolve, reject) {
      request.get('/containers/json', {json:true}, function(err, containers) {
        if (err) reject(err);
        resolve(containers);
      });
    });
  }

  function containersIDs() {
    return containers().then(function(containersIDs) {
      if(Array.isArray(containersIDs) && containersIDs.length > 0) {
        return containersIDs.map(function(container) {
          return container.Id;
        });
      } else {
        return containersIDs;
      }
    }).catch(function(err){
      appConfig.logger.error(err.stack);
    });
  }

  function processes(containerID) {
    return new Q.Promise(function(resolve, reject) {
      request.get('/containers/'+ containerID +'/top', {json:true}, function(err, processes) {
        if (err) reject(err);
        resolve(processes);
      });
    });
  }

  function stats(containerID) {
    return new Q.Promise(function(resolve, reject) {
      request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
        if (err) reject(err);
        resolve(stats);
      });
    });
  }

  function info() {
    return new Q.Promise(function(resolve, reject) {
      request.get('/info', {json:true}, function(err, info) {
        if (err) reject(err);
        resolve(info);
      });
    });
  }

  return {
    containers: containers,
    containersIDs: containersIDs,
    processes: processes,
    stats: stats,
    info: info
  };
})();

module.exports = DockerRemote;
