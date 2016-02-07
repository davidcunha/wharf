'use strict';

var Stats = require('models/stats');

var StatsWorker = function(options) {
  options = options || {};
  if(!options.id) { throw new Error('\'id\' is undefined'); }
  if(!options.entityName) { throw new Error('\'entityName\' is undefined'); }
  if(!options.type) { throw new Error('\'type\' is undefined'); }
  if(!options.process) { throw new Error('\'process\' is undefined'); }

  this.id = options.id;
  this.entityName = options.entity_name;
  this.type = options.type;
  this.process = options.process;
  // this.job = Stats.fetchOp;
};

StatsWorker.prototype.create = function() {
  this.interval = setInterval(function() {
    // this.job();
  }.bind(this), 5000);
};

module.exports = StatsWorker;
