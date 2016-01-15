var docker = require('docker-remote-api'),
  request = docker(),
  Q = require('q');

var DockerRemote = function() {};

DockerRemote.containers = function() {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/json', {json:true}, function(err, containers) {
      if (err) defer.reject(err);
      resolve(containers);
    });
  });
};

DockerRemote.processes = function(containerID) {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/'+ containerID +'/top', {json:true}, function(err, processes) {
      if (err) defer.reject(err);
      resolve(processes);
    });
  });
};

DockerRemote.stats = function(containerID) {
  return new Q.Promise(function(resolve, reject) {
    request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
      if (err) defer.reject(err);
      resolve(stats);
    });
  });
};

module.exports = DockerRemote;
