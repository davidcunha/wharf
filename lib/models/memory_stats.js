'use strict';

var SQliteAdapter = require('services/sqlite_adapter');

var MemoryStats = function() {
  SQliteAdapter.call(this, 'memory_stats');
  this.schemaAttrs = ['id', 'container_name', 'timestamp_day'];

  // time-series attributes for timestamp_day
  for(var i = 0; i < 24; i++) {
    (function(i, self) {
      self.schemaAttrs.push('hour_' + i);
    })(i, this);
  }
};

MemoryStats.prototype = Object.create(SQliteAdapter.prototype);

module.exports = MemoryStats;
