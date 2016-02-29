'use strict';

module.exports = Container;

var SQliteAdapter = require('models/sqlite_adapter')
  , appConfig = require('config/application');

function Container() {
  var container = SQliteAdapter({tableName: 'containers',
                                schemaAttrs: ['container_name', 'container_image', 'container_alias']});
  container.updateContainersList = updateContainersList;
  return container;
}

var updateContainersList = function(containersFromDocker) {
  if(Array.isArray(containersFromDocker) && containersFromDocker.length > 0) {
    return this.findAll(['container_name']).then(function(containersFromDB) {
      containersFromDB = containersFromDB.map(function(container) {
        return container.container_name;
      });

      // refresh containers in database: add new containers, delete old ones
      containersFromDocker.forEach(function(container) {
        if(containersFromDB.indexOf(container.Id) < 0) {
          appConfig.logger.info('add container: ' + container.Id);
          this.create({container_name: container.Id,
                    container_image: container.Image,
                    container_alias: container.Names[0].replace(/\//, '')}).then(function(res) {
            return res;
          }).catch(function(err) {
            appConfig.logger.error(err.stack);
          });
        }
      }, this);

      containersFromDB.forEach(function(containerID) {
        var containersFromDockerIDs = containersFromDocker.map(function(container) {
          return container.Id;
        });

        if(containersFromDockerIDs.indexOf(containerID) < 0) {
          appConfig.logger.info('delete container: ' + containerID);
          this.delete({container_name: containerID}).then(function(res) {
            return res;
          }).catch(function(err) {
            appConfig.logger.error(err.stack);
          });
        }
      }, this);

      return containersFromDocker;
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  } else {
    return containersFromDocker;
  }
};
