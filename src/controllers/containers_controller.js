'use strict';

import DockerRemote from '../services/docker_remote';
import Container from '../models/container';
import MemoryStats from '../models/memory_stats';
import config from '../config/application';

/**
 * Request Validator.
 * Validator used to validate input parameters
 *
 * @Object
 * @throws {Error} Will throw an error if there is a missing parameter
 */
const requestValidator = {
  apply: function(target, thisArg, [requiredParams] = {}) {
    let requestParams = {
      params: target().req.params,
      query: target().req.query
    };

    if(Object.keys(requiredParams).length > 0) {
      for(let requiredParam of Object.keys(requiredParams)) {
        if(Object.keys(requestParams[requiredParam]).length > 0) {
          for(let param of requiredParams[requiredParam]) {
            if(Object.keys(requestParams[requiredParam]).indexOf(param) < 0) {
              throw new Error(`missing parameter: ${param}`);
            }
          }
        } else {
          throw new Error(`missing parameter: ${requiredParam}`);
        }
      }
    } else {
      throw new Error('missing all required parameters');
    }
  }
};

/**
 * ContainersController.
 * Controller for requests regarding Container model.
 *
 * @Function
 * @this {ContainersController}
 * @param {Object} router - Express router used to mount controller's routes
 */
function ContainersController(router) {
  /**
   * GET request /api/v1/info
   * Information about Docker environment
   *
   * @param {String} route name
   * @param {Function} callback with request and response objects
   * @return {Object} JSON object with response (success, error)
   */
  router.get('/api/v1/info', function(req, res){
    DockerRemote.info().then(function(info){
      config.logger.info(`Response: ${JSON.stringify(info)}`);
      res.json(info);
    }).catch(function(err) {
      config.logger.info(`Response: ${JSON.stringify(err)}`);
      res.status(500).send(err);
    });
  });

  /**
   * GET request /api/v1/containers
   * All available containers
   *
   * @param {String} route name
   * @param {Function} callback with request and response objects
   * @return {Object} JSON object with response (success, error)
   */
  router.get('/api/v1/containers', function(req, res){
    Container().findAll().then(function(containers){
      config.logger.info(`Response: ${JSON.stringify(containers)}`);
      res.json(containers);
    }).catch(function(err) {
      config.logger.info(`Response: ${JSON.stringify(err)}`);
      res.status(500).send(err);
    });
  });

  /**
   * GET request /api/v1/containers/:container_name/memory_stats
   * Memory statistics from a specific container
   *
   * @param {String} route name
   * @param {Function} callback with request and response objects
   * @return {Object} JSON object with response (success, error)
   */
  router.get('/api/v1/containers/:container_name/memory_stats', function(req, res) {
    try {
      let validator = new Proxy(function() {return {req: req};}, requestValidator);
      validator({params: ['container_name'], query: ['filter', 'ud']});

      MemoryStats().findAll({container_name: req.params.container_name},
                        {filter: req.query.filter, ud: req.query.ud}).then(function(memoryStats) {
        config.logger.info(`Response: ${JSON.stringify(memoryStats)}`);
        res.json(memoryStats);
      }).catch(function(err) {
        config.logger.info(`Response: ${JSON.stringify(err)}`);
        res.status(500).send(err);
      });
    } catch(err) {
      config.logger.info(`Response: ${JSON.stringify(err)}`);
      res.status(400).send({error: err.message});
    }
  });

  /**
   * GET request /api/v1/containers/:id/stats
   * All statistics from a specific container
   *
   * @param {String} route name
   * @param {Function} callback with request and response objects
   * @return {Object} JSON object with response (success, error)
   */
  router.get('/api/v1/containers/:id/stats', function(req, res){
    DockerRemote.stats(req.params.id).then(function(stats){
      config.logger.info(`Response: ${JSON.stringify(stats)}`);
      res.json(stats);
    }).catch(function(err) {
      config.logger.info(`Response: ${JSON.stringify(err)}`);
      res.status(500).send(err);
    });
  });

  /**
   * GET request /api/v1/containers/:id/processes
   * All processes running in a specific container
   *
   * @param {String} route name
   * @param {Function} callback with request and response objects
   * @return {Object} JSON object with response (success, error)
   */
  router.get('/api/v1/containers/:id/processes', function(req, res){
    DockerRemote.processes(req.params.id).then(function(processes){
      config.logger.info(`Response: ${JSON.stringify(processes)}`);
      res.json(processes);
    }).catch(function(err) {
      config.logger.info(`Response: ${JSON.stringify(err)}`);
      res.status(500).send(err);
    });
  });
}

export default ContainersController;
