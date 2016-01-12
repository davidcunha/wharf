require('./config/config');

var express = require('express'),
  app = express(),
  DockerRemote = require(__services + 'docker_remote');

app.get('/containers', function(req, res){
  DockerRemote.containers().then(function(containers){
    res.json(containers);
  });
});

app.get('/containers/:id/stats', function(req, res){
  if(req.params.id === undefined || req.params.id === null) {
    res.status(500).json({ error: 'container id missing' });
  } else {
    DockerRemote.stats(req.params.id).then(function(stats){
      res.json(stats);
    });
  }
});

app.listen(3000);
console.log('Server listening on port 3000');
