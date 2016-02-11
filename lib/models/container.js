'use strict';

module.exports = Container;

var SQliteAdapter = require('models/sqlite_adapter')
  , appConfig = require('config/application');

function Container() {
  var container = SQliteAdapter({tableName: 'containers', schemaAttrs: ['container_name']});
  container.updateContainersList = updateContainersList;
  return container;
}

var updateContainersList = function(containersIDsFromDocker) {
  var _self = this;
  if(Array.isArray(containersIDsFromDocker) && containersIDsFromDocker.length > 0) {
    return this.findAll(['container_name']).then(function(containersFromDB) {
      containersFromDB = containersFromDB.map(function(container) {
        return container.container_name;
      });

      // refresh containers in database: add new containers, delete old ones
      refreshContainers.call(_self, containersIDsFromDocker, containersFromDB);

      return containersIDsFromDocker;
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  }
};

var refreshContainers = function(containersIDsFromDocker, containersFromDB) {
  containersIDsFromDocker.forEach(function(containerID) {
    if(containersFromDB.indexOf(containerID) < 0) {
      appConfig.logger.info('add container: ' + containerID);
      this.create({container_name: containerID}).then(function(res) {
        return res;
      }).catch(function(err) {
        appConfig.logger.error(err.stack);
      });
    }
  }, this);

  containersFromDB.forEach(function(containerID) {
    if(containersIDsFromDocker.indexOf(containerID) < 0) {
      appConfig.logger.info('delete container: ' + containerID);
      this.delete({container_name: containerID}).then(function(res) {
        return res;
      }).catch(function(err) {
        appConfig.logger.error(err.stack);
      });
    }
  }, this);
};
