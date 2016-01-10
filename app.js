var express = require('express');
var app = express();
var DockerRemote = require('./app/services/docker_remote');

new DockerRemote().stats('999f3c428c18');

app.get('/', function(req, res){
  res.send('hello world');
});

app.listen(3000);
