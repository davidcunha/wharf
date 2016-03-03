'use strict';

module.exports = MemoryStats;

var SQliteAdapter = require('./sqlite_adapter');

function MemoryStats() {
  var schemaAttrs = ['container_name', 'timestamp_day'];
  for(var i = 0; i < 24; i++) {
    prePopulateTimestampForDay(schemaAttrs, i);
  }

  var memoryStats = SQliteAdapter({modelName: 'MemoryStats',
                                  tableName: 'memory_stats',
                                  schemaAttrs: schemaAttrs,
                                  associations: {belongsTo: 'containers'}});

  return memoryStats;
}

function prePopulateTimestampForDay(schemaAttrs, i) {
  schemaAttrs.push('hour_' + i);
}
