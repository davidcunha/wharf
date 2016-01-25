'use strict';

var SQliteAdapter = require('services/sqlite_adapter');

var Container = function() {
  SQliteAdapter.call(this, 'containers');
  this.schemaAttrs = ['id', 'container_name'];
};

Container.prototype = Object.create(SQliteAdapter.prototype);

Container.prototype.create = function(attrs) {
  attrs = attrs || {};
  if(this.validateAttrs.call(this, attrs)) {
    var insertionAttrs = this.insertion(attrs);
    return this.exec('INSERT INTO ' + this.tableName + ' ' + insertionAttrs).then(function(res) {
      return res;
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
};

Container.prototype.find = function(attrs) {
  attrs = attrs || {};
  if(this.validateAttrs.call(this, attrs)) {
    var selectionAttrs = this.selection(attrs);
    return this.all('SELECT * FROM ' + this.tableName + ' ' + selectionAttrs).then(function(container) {
      return container;
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
};

Container.prototype.findAll = function() {
  return this.all('SELECT * FROM ' + this.tableName).then(function(containers) {
    return containers;
  }).catch(function(err) {
    console.log(err.stack);
  });
};

var ContainerFactory = (function() {
  var instance;
  function createInstance() {
    var container = new Container();
    return container;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

module.exports = ContainerFactory;
