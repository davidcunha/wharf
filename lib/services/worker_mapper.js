'use strict';

var WorkerMapper = function() {
  this.workersList = [];
};

WorkerMapper.prototype.create = function(worker) {
  this.workersList.push(worker);
};

WorkerMapper.prototype.find = function(options) {
  options = options || {};
  if(Object.keys(options).length === 0) { return; }

  // searching by looking to first attribute
  var attr = Object.keys(options)[0];

  return this.workersList.find(function(worker) {
    if(worker[attr] === options[attr]) {
      return worker;
    }
  });
};

WorkerMapper.prototype.findAll = function() {
  return this.workersList;
};

WorkerMapper.prototype.destroy = function(worker) {
  clearInterval(worker.interval);
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
