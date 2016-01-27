'use strict';

var SQliteAdapter = require('services/sqlite_adapter');

var MemoryStats = function() {
  SQliteAdapter.call(this, 'memory_stats');
  this.schemaAttrs = ['id', 'container_id', 'timestamp_day'];

  // time-series attributes for timestamp_day
  for(var i = 0; i < 24; i++) {
    (function(i, self) {
      self.schemaAttrs.push('hour_' + i);
    })(i, this);
  }
};

MemoryStats.prototype = Object.create(SQliteAdapter.prototype);

var MemoryStatsFactory = (function() {
  var instance;
  function createInstance() {
    var memoryStats = new MemoryStats();
    return memoryStats;
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

module.exports = MemoryStatsFactory;
