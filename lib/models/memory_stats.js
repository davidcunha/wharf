'use strict';

var SQliteAdapter = require('models/sqlite_adapter');

var MemoryStats = function() {
  var schemaAttrs = ['container_name', 'timestamp_day'];
  for(var i = 0; i < 24; i++) {
    (function(i) {
      schemaAttrs.push('hour_' + i);
    })(i);
  }

  var memoryStats = SQliteAdapter({tableName: 'memory_stats', schemaAttrs: schemaAttrs});
  return memoryStats;
};

module.exports = MemoryStats;
