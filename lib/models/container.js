'use strict';

var SQliteAdapter = require('services/sqlite_adapter');

var Container = function() {
  SQliteAdapter.call(this, 'containers');
  this.schemaAttrs = ['id', 'container_name'];
};

Container.prototype = Object.create(SQliteAdapter.prototype);

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
          console.log('add container: ' + containerID);
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
          console.log('delete container: ' + containerID);
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
