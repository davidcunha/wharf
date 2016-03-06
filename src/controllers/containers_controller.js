'use strict';

var express = require('express')
  , app = express()
  , DockerRemote = require('../services/docker_remote')
  , Container = require('../models/container')
  , MemoryStats = require('../models/memory_stats')
  , appConfig = require('../config/application')
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

app.get('/api/v1/containers/:container_name/memory_stats', function(req, res) {
  var validation = validateRequest(req, {params: ['container_name'], query: ['filter', 'ud']});

  if(validation.errors.length > 0) {
    res.status(400).send({errors: validation.errors});
  } else {
    MemoryStats().findAll({container_name: req.params.container_name},
                      {filter: req.query.filter, ud: req.query.ud}).then(function(memoryStats) {
      res.json(memoryStats);
    }).catch(function(err) {
      res.send(err);
    });
  }

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

function validateRequest(req, requiredParams) {
  var validation = {errors: []};

  Object.keys(requiredParams).every(function(rootParam) {
    if(req.hasOwnProperty[rootParam] === false) {
      validation.errors.push('missing parameter ' + rootParam);
      return false;
    } else {
      return requiredParams[rootParam].every(function(param) {
        if(Object.keys(req[rootParam]).indexOf(param) < 0) {
          validation.errors.push('missing parameter ' + param);
          return false;
        } else {
          return true;
        }
      });
    }
  });

  return validation;
}
