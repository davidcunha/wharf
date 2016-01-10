var express = require('express'),
  app = express(),
  config = require('./config/config'),
  DockerRemote = require(__services + 'docker_remote');

app.get('/', function(req, res){
  new DockerRemote().stats('999f3c428c18');
  res.send('hello world');
});

app.listen(3000);
