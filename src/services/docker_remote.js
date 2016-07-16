'use strict';

const Docker = require('docker-remote-api');
const Promise = require('bluebird');
import appConfig from '../config/application';

const DockerRemote = (function() {
  let request = Docker();

  function containers() {
    return new Promise(function(resolve, reject) {
      request.get('/containers/json', {json:true}, function(err, containers) {
        if (err) reject(err);
        resolve(containers);
      });
    });
  }

  function containersIDs() {
    return containers().then(function(containersIDs = []) {
      if(containersIDs.length > 0) {
        return containersIDs.map(container => container.Id);
      } else {
        return containersIDs;
      }
    }).catch(function(err){
      appConfig.logger.error(err.stack);
    });
  }

  function processes(containerID) {
    return new Promise(function(resolve, reject) {
      request.get(`/containers/${containerID}/top`, {json:true}, function(err, processes) {
        if (err) reject(err);
        resolve(processes);
      });
    });
  }

  function stats(containerID) {
    return new Promise(function(resolve, reject) {
      request.get(`/containers/${containerID}/stats?stream=false`, {json:true}, function(err, stats) {
        if (err) reject(err);
        resolve(stats);
      });
    });
  }

  function info() {
    return new Promise(function(resolve, reject) {
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

export default DockerRemote;
