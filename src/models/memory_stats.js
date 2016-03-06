'use strict';

module.exports = MemoryStats;

var SQliteAdapter = require('./sqlite_adapter')
  , StatsFilters = require('./stats_filters');

function MemoryStats() {
  var schemaAttrs = ['container_name', 'timestamp_day'];
  prePopulateTimestampForDay(schemaAttrs);

  var memoryStats = SQliteAdapter({modelName: 'MemoryStats',
                                  tableName: 'memory_stats',
                                  schemaAttrs: schemaAttrs,
                                  associations: {belongsTo: 'containers'}});

  /**
  * Override find from SQliteAdapter to apply UI filters
  */
  var findAll = memoryStats.findAll;
  memoryStats.findAll = function(selectionAttrs, projectionAttrs, filter) {
    if(Array.isArray(projectionAttrs) === false && (projectionAttrs !== undefined || projectionAttrs !== null)) {
      filter = projectionAttrs;

      StatsFilters().applyPreFilter(filter, selectionAttrs);

      return findAll.call(this, selectionAttrs).then(function(stats) {
        return stats;
      });
    } else {
      if(filter !== undefined || filter !== null) {
        // TODO filter data before call
        return findAll.call(this, selectionAttrs, projectionAttrs);
      } else {
        return findAll.call(this, selectionAttrs, projectionAttrs);
      }
    }
  };

  return memoryStats;
}

function prePopulateTimestampForDay(schemaAttrs) {
  for(var i = 0; i < 24; i++) {
    schemaAttrs.push('hour_' + i);
  }
}
