'use strict';

var docker = require('docker-remote-api')
  , request = docker()
  , Q = require('q');

function DockerRemote (){}

DockerRemote.containers = function() {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/json', {json:true}, function(err, containers) {
      if (err) reject(err);
      resolve(containers);
    });
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
