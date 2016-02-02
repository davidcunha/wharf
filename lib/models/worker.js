'use strict';

var Worker = function(options) {
  options = options || {};
  if(!options.id) { throw new Error('\'id\' is undefined'); }
  if(!options.entity_name) { throw new Error('\'entity_name\' is undefined'); }
  if(!options.type) { throw new Error('\'type\' is undefined'); }
  if(!options.process) { throw new Error('process is undefined'); }

  this.id = options.id;
  this.entity_name = options.entity_name;
  this.type = options.type;
  this.process = options.process;
};

Worker.prototype.create = function() {
  this.interval = setInterval(function() {
    console.log('worker ' + this.id + ' fetching data source... with process id ' + (this.process ? this.process.process.pid : 'null') + ' for entity_name ' + this.entity_name);
  }.bind(this), 5000);
  return this;
};

module.exports = Worker;
