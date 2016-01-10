var docker = require('docker-remote-api');
var request = docker();

var DockerRemote = function (opts) {};

DockerRemote.prototype.stats = function(containerID) {
  request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
    if (err) throw err;
    console.log('stats', JSON.stringify(stats));
  });
};

module.exports = DockerRemote;
