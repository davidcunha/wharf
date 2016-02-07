'use strict';

var StatsWorkerMapper = function() {
  this.workersList = [];
};

StatsWorkerMapper.prototype.create = function(worker) {
  this.workersList.push(worker);
};

StatsWorkerMapper.prototype.find = function(workerAttrs) {
  workerAttrs = workerAttrs || {};
  if(Object.keys(workerAttrs).length === 0) { return; }

  // only looks for the first attribute
  var attr = Object.keys(workerAttrs)[0];

  return this.workersList.find(function(worker) {
    if(worker[attr] === workerAttrs[attr]) {
      return worker;
    }
  });
};

StatsWorkerMapper.prototype.findAll = function() {
  return this.workersList;
};

StatsWorkerMapper.prototype.destroy = function(workerAttrs) {
  var worker = this.find(workerAttrs);
  if(worker) {
    clearInterval(worker.interval);
    this.workersList.splice(worker, 1);
    return true;
  }
};

module.exports = (function() {
  var instance;
  function createInstance() {
    var statsWorkerMapper = new StatsWorkerMapper();
    return statsWorkerMapper;
  }

  function getInstance() {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  }

  return getInstance();
})();
