'use strict';

var DataFetcher = function(options) {
  this.options = options || {};
};

DataFetcher.prototype.create = function() {
  this.interval = setInterval(function() {
    console.log('worker ' + this.options.id + ' fetching data source... with process id ' + (this.options.worker ? this.options.worker.process.pid : 'null'));
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
