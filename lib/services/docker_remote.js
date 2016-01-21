'use strict';

var docker = require('docker-remote-api')
  , request = docker()
  , Q = require('q');

var DockerRemote = function() {
  this.DOCKER_CERT_PATH  = process.env.DOCKER_CERT_PATH;
  this.DOCKER_HOST       = process.env.DOCKER_HOST;
  this.DOCKER_TLS_VERIFY = process.env.DOCKER_TLS_VERIFY;
};

DockerRemote.containers = function() {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/json', {json:true}, function(err, containers) {
      if (err) reject(err);
      resolve(containers);
    });
  });
};

DockerRemote.containersIDs = function() {
  return this.containers().then(function(containers) {
    return containers.map(function(container) {
      return container.Id;
    });
  }).catch(function(err){
    console.log(err.stack);
  });
};

DockerRemote.processes = function(containerID) {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/'+ containerID +'/top', {json:true}, function(err, processes) {
      if (err) reject(err);
      resolve(processes);
    });
  });
};

DockerRemote.stats = function(containerID) {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
      if (err) reject(err);
      resolve(stats);
    });
  });
};

DockerRemote.info = function() {
  return new Q.Promise(function(resolve, reject) {
    request.get('/info', {json:true}, function(err, info) {
      if (err) reject(err);
      resolve(info);
    });
  });
};

module.exports = DockerRemote;
