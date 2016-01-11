var docker = require('docker-remote-api'),
  request = docker(),
  Q = require('q');

var DockerRemote = function() {};

DockerRemote.stats = function(containerID) {
  var defer = Q.defer();
  request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
    if (err) defer.reject(err);
    defer.resolve(stats);
  });
  return defer.promise;
};

module.exports = DockerRemote;
