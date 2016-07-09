'use strict';

module.exports = Stats;

function Stats($resource) {
  return {
    query: function(statsType, options) {
      var resource = $resource('/api/v1/containers/:container_name/memory_stats');
      return resource.query(options).$promise.then(function(statsData) {
        return statsData;
      });
    }
  };
}
