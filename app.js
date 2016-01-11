require('./config/config');

var express = require('express'),
  app = express(),
  DockerRemote = require(__services + 'docker_remote');

app.get('/', function(req, res){
  DockerRemote.stats('999f3c428c18').then(function(stats){
    console.log(stats);
  });

  res.send('hello world');
});

app.listen(3000);
console.log('Server listening on port 3000');
