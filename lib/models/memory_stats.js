'use strict';

var SQliteAdapter = require('models/sqlite_adapter');

var MemoryStats = function() {
  var schemaAttrs = ['container_name', 'timestamp_day'];
  for(var i = 0; i < 24; i++) {
    prePopulateTimestampForDay(schemaAttrs, i);
  }

  var memoryStats = SQliteAdapter({tableName: 'memory_stats', schemaAttrs: schemaAttrs});
  return memoryStats;
};

function prePopulateTimestampForDay(schemaAttrs, i) {
  schemaAttrs.push('hour_' + i);
}

module.exports = MemoryStats;
