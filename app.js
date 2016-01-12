require('./config/config');

var express = require('express'),
  app = express(),
  DockerRemote = require(__services + 'docker_remote');

app.get('/containers', function(req, res){
  DockerRemote.containers().then(function(containers){
    res.json(containers);
  });
});

app.param(function(req, res, next, val) {
  if (val === undefined || val === null) {
    next();
  }
  else {
    res.status(500).json({ error: 'container id missing' });
  }
});

app.get('/containers/:id/stats', function(req, res){
  DockerRemote.stats(req.params.id).then(function(stats){
    res.json(stats);
  });
});

app.get('/containers/:id/processes', function(req, res){
  DockerRemote.processes(req.params.id).then(function(processes){
    res.json(processes);
  });
});

app.listen(3000);
console.log('Server listening on port 3000');
