'use strict';

const Docker = require('docker-remote-api');
const Promise = require('bluebird');

/**
 * DockerRemote.
 * Callable service that integrates with Docker API
 *
 * @Function
 * @this {DockerRemote}
 * @return {DockerRemote} The new DockerRemote object
 */
const DockerRemote = (function() {
  let request = Docker();

  /**
   * List of containers.
   *
   * @this {DockerRemote}
   * @return {Promise} A promise for the response
   */
  function containers() {
    return new Promise(function(resolve, reject) {
      request.get('/containers/json', {json:true}, function(err, containers) {
        if (err) reject(err);
        resolve(containers);
      });
    });
  }

  /**
   * List of processes in a specific ontainer.
   *
   * @this {DockerRemote}
   * @param {String} - container ID
   * @return {Promise} A promise for the response
   */
  function processes(containerID) {
    return new Promise(function(resolve, reject) {
      request.get(`/containers/${containerID}/top`, {json:true}, function(err, processes) {
        if (err) reject(err);
        resolve(processes);
      });
    });
  }

  /**
   * Statistics from a specific ontainer.
   *
   * @this {DockerRemote}
   * @param {String} - container ID
   * @return {Promise} A promise for the response
   */
  function stats(containerID) {
    return new Promise(function(resolve, reject) {
      request.get(`/containers/${containerID}/stats?stream=false`, {json:true}, function(err, stats) {
        if (err) reject(err);
        resolve(stats);
      });
    });
  }

  /**
   * Information about Docker environment
   *
   * @this {DockerRemote}
   * @return {Promise} A promise for the response
   */
  function info() {
    return new Promise(function(resolve, reject) {
      request.get('/info', {json:true}, function(err, info) {
        if (err) reject(err);
        resolve(info);
      });
    });
  }

  return {
    containers: containers,
    processes: processes,
    stats: stats,
    info: info
  };
})();

export default DockerRemote;
