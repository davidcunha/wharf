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

Container.prototype.delete = function(attrs) {
  attrs = attrs || {};
  if(this.validateAttrs.call(this, attrs)) {
    var selectionAttrs = this.selection(attrs);
    return this.exec('DELETE FROM ' + this.tableName + ' ' + selectionAttrs).then(function(res) {
      return res;
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
};

Container.prototype.find = function(attrs, projectionAttrs) {
  attrs = attrs || {};
  projectionAttrs = projectionAttrs || [];
  if(this.validateAttrs.apply(this, [attrs, projectionAttrs])) {
    var selectionAttrs = this.selection(attrs);
    projectionAttrs = this.projection(projectionAttrs);
    return this.all('SELECT ' + projectionAttrs + ' FROM ' + this.tableName + ' ' + selectionAttrs).then(function(container) {
      return container;
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
};

Container.prototype.findAll = function(projectionAttrs) {
  projectionAttrs = projectionAttrs || [];
  if(this.validateAttrs.apply(this, [null, projectionAttrs])) {
    projectionAttrs = this.projection(projectionAttrs);
    return this.all('SELECT ' + projectionAttrs + ' FROM ' + this.tableName).then(function(containers) {
      return containers;
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
};

Container.prototype.updateContainersList = function(containersIDsFromDocker) {
  var _self = this;
  if(Array.isArray(containersIDsFromDocker) && containersIDsFromDocker.length > 0) {
    return this.findAll(['container_name']).then(function(containersFromDB) {
      containersFromDB = containersFromDB.map(function(container) {
        return container.container_name;
      });

      // find new containers to add
      containersIDsFromDocker.forEach(function(containerID) {
        if(containersFromDB.indexOf(containerID) < 0) {
          console.log('add: ' + containerID);
          _self.create({container_name: containerID}).then(function(res) {
            return res;
          }).catch(function(err) {
            console.log(err.stack);
          });
        }
      });

      // find containers to delete
      containersFromDB.forEach(function(containerID) {
        if(containersIDsFromDocker.indexOf(containerID) < 0) {
          console.log('delete: ' + containerID);
          _self.delete({container_name: containerID}).then(function(res) {
            return res;
          }).catch(function(err) {
            console.log(err.stack);
          });
        }
      });
    }).catch(function(err) {
      console.log(err.stack);
    });
  }
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
