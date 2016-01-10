var docker = require('docker-remote-api');

var DockerRemote = function (opts) {
  this.request = docker();
};

DockerRemote.prototype.stats = function(containerID) {
  this.request.get('/containers/'+ containerID +'/stats?stream=false', {json:true}, function(err, stats) {
    if (err) throw err;
    console.log('stats', JSON.stringify(stats));
  });
};

module.exports = DockerRemote;
