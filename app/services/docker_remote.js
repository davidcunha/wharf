var docker = require('docker-remote-api'),
  request = docker(),
  Q = require('q');

var DockerRemote = function() {};

DockerRemote.containers = function() {
  var defer = Q.defer();
  request.get('/containers/json', {json:true}, function(err, containers) {
    if (err) defer.reject(err);
    defer.resolve(containers);
  });
  return defer.promise;
};

DockerRemote.processes = function(containerID) {
  var defer = Q.defer();
  request.get('/containers/'+ containerID +'/top', {json:true}, function(err, processes) {
    if (err) defer.reject(err);
    defer.resolve(processes);
  });
  return defer.promise;
};

DockerRemote.stats = function(containerID) {
  var defer = Q.defer();
  request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
    if (err) defer.reject(err);
    defer.resolve(stats);
  });
  return defer.promise;
};

module.exports = DockerRemote;
