'use strict';

var DataFetcher = function(options) {
  options = options || {};
  if(!options.id) { throw new Error('\'id\' is undefined'); }
  if(!options.entity_name) { throw new Error('\'entity_name\' is undefined'); }
  if(!options.type) { throw new Error('\'type\' is undefined'); }
  if(!options.worker) { throw new Error('worker is undefined'); }

  this.id = options.id;
  this.entity_name = options.entity_name;
  this.type = options.type;
  this.worker = options.worker;
};

DataFetcher.prototype.create = function() {
  this.interval = setInterval(function() {
    console.log('worker ' + this.id + ' fetching data source... with process id ' + (this.worker ? this.worker.process.pid : 'null') + ' for entity_name ' + this.entity_name);
  }.bind(this), 5000);
  return this;
};

DataFetcher.prototype.status = function() {
  throw new Error('Not implemented yet');
};

DataFetcher.prototype.kill = function() {
  clearInterval(this.interval);
};

module.exports = DataFetcher;
