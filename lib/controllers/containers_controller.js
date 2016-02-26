'use strict';

var express = require('express')
  , app = express()
  , DockerRemote = require('services/docker_remote')
  , Container = require('models/container')
  , appConfig = require('config/application')
  , path = require('path');

app.use(express.static(path.resolve(__dirname + '/../public')));

app.get('/api/v1/info', function(req, res){
  DockerRemote.info().then(function(info){
    res.json(info);
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/api/v1/containers', function(req, res){
  Container().findAll().then(function(containers){
    res.json(containers);
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/api/v1/containers/:id/stats', function(req, res){
  DockerRemote.stats(req.params.id).then(function(stats){
    res.json(stats);
  }).catch(function(err) {
    res.send(err);
  });
});

app.get('/api/v1/containers/:id/processes', function(req, res){
  DockerRemote.processes(req.params.id).then(function(processes){
    res.json(processes);
  }).catch(function(err) {
    res.send(err);
  });
});

app.listen(3000);
appConfig.logger.info('Wharf listening on port 3000');
