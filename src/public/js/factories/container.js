
'use strict';

module.exports = Container;

function Container($resource) {
  return $resource('/api/v1/containers/:id');
}
