'use strict';

var SQliteAdapter = require('services/sqlite_adapter');

var Container = function() {
  SQliteAdapter.call(this, 'containers');
  this.schemaAttrs = ['id', 'container_name'];
};

Container.prototype = Object.create(SQliteAdapter.prototype);

Container.prototype.find = function(attrs) {
  attrs = attrs || {};
  if(this.validateAttrs.call(this, attrs)) {
    var selection = this.prepareSelection(attrs);
    this.execute('SELECT * FROM ' + this.tableName + ' ' + selection).then(function(container) {
      console.log(container);
      return container;
    }).catch(function(err) {
      console.log(err);
    });
  }
};

module.exports = Container;
