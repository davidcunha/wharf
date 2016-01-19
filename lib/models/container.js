'use strict';

var SQliteORM = require('services/sqlite_adapter');

var Container = function() {
  SQliteORM.call(this, 'containers');
};

Container.prototype = Object.create(SQliteORM.prototype);

Container.prototype.find = function(attrs) {
  attrs = attrs || {};
  if(this.validateAttrs(attrs)) {
    this.execute('SELECT * FROM ' + this.tableName + ' WHERE id = ' + attrs.id).then(function(container) {
      return container;
    }).catch(function(err) {
      console.log(err);
    });
  }
};

module.exports = Container;
