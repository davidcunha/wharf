
'use strict';

module.exports = MemoryStats;

function MemoryStats($resource) {
  return $resource('/api/v1/containers/:id');
}
