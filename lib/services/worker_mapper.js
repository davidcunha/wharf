'use strict';

var WorkerMapper = function() {
  this.workersList = [];
};

WorkerMapper.prototype.create = function(worker) {
  this.workersList.push(worker);
};

WorkerMapper.prototype.find = function(workerAttrs) {
  workerAttrs = workerAttrs || {};
  if(Object.keys(workerAttrs).length === 0) { return; }

  // searching by looking to first attribute
  var attr = Object.keys(workerAttrs)[0];

  return this.workersList.find(function(worker) {
    if(worker[attr] === workerAttrs[attr]) {
      return worker;
    }
  });
};

WorkerMapper.prototype.findAll = function() {
  return this.workersList;
};

WorkerMapper.prototype.destroy = function(workerAttrs) {
  var worker = this.find(workerAttrs);
  if(worker) {
    clearInterval(worker.interval);
    this.workersList.splice(worker, 1);
    return true;
  }
};

var WorkerMapperFactory = (function() {
  var instance;
  function createInstance() {
    var workerMapper = new WorkerMapper();
    return workerMapper;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

module.exports = WorkerMapperFactory;
