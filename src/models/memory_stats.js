'use strict';

module.exports = MemoryStats;

var SQliteAdapter = require('./sqlite_adapter')
  , StatsFilters = require('../utils/stats_filters');

/**
 * MemoryStats
 * Represents the memory stats from a Docker container.
 * Delegates ORM properties to SQliteAdapter @see {@link SQliteAdapter}.
 *
 * @Function
 * @this {MemoryStats}
 * @return {MemoryStats} The new MemoryStats object
 */
function MemoryStats() {
  var schemaAttrs = ['container_name', 'timestamp_day'];
  prePopulateTimestampForDay(schemaAttrs);

  var memoryStats = SQliteAdapter({modelName: 'MemoryStats',
                                  tableName: 'memory_stats',
                                  schemaAttrs: schemaAttrs,
                                  associations: {belongsTo: 'containers'}});

  /**
   * Finds all memory stats applying filters @see {@link findAll} @see {@link SQliteAdapter}
   *
   * @override
   */
  var findAll = memoryStats.findAll;
  memoryStats.findAll = function(selectionAttrs, projectionAttrs, filter) {
    if(Array.isArray(projectionAttrs) === false && (projectionAttrs !== undefined || projectionAttrs !== null)) {
      filter = projectionAttrs;

      StatsFilters(filter).applyBeforeFilter(selectionAttrs);

      return findAll.call(this, selectionAttrs).then(function(stats) {
        return StatsFilters(filter).applyAfterFilter(stats);
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

/**
 * Populates model schema attributes with 24 columns: hour_0, hour_1, ... hour_23.
 *
 * @private
 * @param {Array} schemaAttrs - model schema attributes
 */
function prePopulateTimestampForDay(schemaAttrs) {
  for(var i = 0; i < 24; i++) {
    schemaAttrs.push('hour_' + i);
  }
}
