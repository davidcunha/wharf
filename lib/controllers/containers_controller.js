'use strict';

var express = require('express')
  , app = express()
  , DockerRemote = require('services/docker_remote');

app.get('/info', function(req, res){
  DockerRemote.info().then(function(info){
    res.json(info);
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/containers', function(req, res){
  DockerRemote.containers().then(function(containers){
    res.json(containers);
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/containers/:id/stats', function(req, res){
  DockerRemote.stats(req.params.id).then(function(stats){
    res.json(stats);
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/containers/:id/processes', function(req, res){
  DockerRemote.processes(req.params.id).then(function(processes){
    res.json(processes);
  }).catch(function(err) {
    res.send(err);
  });
});

app.listen(3000);
console.log('Server listening on port 3000');
