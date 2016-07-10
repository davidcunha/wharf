'use strict';
import DockerRemote from '../services/docker_remote';
import Container from '../models/container';
import MemoryStats from '../models/memory_stats';

const requestValidator = {
  apply: function(target, thisArg, requiredParams) {
    let req = target().req;
    requiredParams = requiredParams[0];
    Object.keys(requiredParams).forEach(function(requiredParam) {
      if(requiredParam in req === false) {
        throw new Error(`missing parameter: ${requiredParam}`);
      } else {
        requiredParams[requiredParam].forEach(function(param) {
          if(Object.keys(req[requiredParam]).indexOf(param) < 0) {
            throw new Error(`missing parameter: ${requiredParam}`);
          }
        });
      }
    });
  }
};

function ContainersController(app) {
  app.get('/api/v1/info', function(req, res){
    DockerRemote.info().then(function(info){
      res.json(info);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });

  app.get('/api/v1/containers', function(req, res){
    Container().findAll().then(function(containers){
      res.json(containers);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });

  app.get('/api/v1/containers/:container_name/memory_stats', function(req, res) {
    try {
      let validator = new Proxy(function() {return {req: req};}, requestValidator);
      validator({params: ['container_name'], query: ['filter', 'ud']});
      MemoryStats().findAll({container_name: req.params.container_name},
                        {filter: req.query.filter, ud: req.query.ud}).then(function(memoryStats) {
        res.json(memoryStats);
      }).catch(function(err) {
        res.status(500).send(err);
      });
    } catch(e) {
      res.status(400).send({error: e.message});
    }
  });

  app.get('/api/v1/containers/:id/stats', function(req, res){
    DockerRemote.stats(req.params.id).then(function(stats){
      res.json(stats);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });

  app.get('/api/v1/containers/:id/processes', function(req, res){
    DockerRemote.processes(req.params.id).then(function(processes){
      res.json(processes);
    }).catch(function(err) {
      res.status(500).send(err);
    });
  });
}

export default ContainersController;
