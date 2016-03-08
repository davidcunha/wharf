'use strict';

module.exports = Container;

var SQliteAdapter = require('./sqlite_adapter')
  , appConfig = require('../config/application');

/**
 * Container
 * Represents a Docker container.
 * Delegates ORM properties to SQliteAdapter @see {@link SQliteAdapter}.
 *
 * @Function
 * @this {Container}
 * @return {Container} The new Container object
 */
function Container() {
  var container = SQliteAdapter({modelName: 'Container',
                                tableName: 'containers',
                                schemaAttrs: ['container_name', 'container_image', 'container_alias'],
                                associations: {hasMany: 'memory_stats'}});

  container.updateContainersList = updateContainersList;
  return container;
}

/**
 * Updates the existing containers list: add new containers, delete old ones.
 *
 * @private
 * @this {Container}
 * @param {Array} containersFromDocker - containers list from Docker
 * @return {Array} containers - updated containers list
 */
var updateContainersList = function(containersFromDocker) {
  var containers = containersFromDocker;

  if(Array.isArray(containers) && containers.length > 0) {
    return this.findAll(['container_name']).then(function(containersFromDB) {
      containersFromDB = containersFromDB.map(function(container) {
        return container.container_name;
      });

      containers.forEach(function(container) {
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
        var containersIDs = containers.map(function(container) {
          return container.Id;
        });

        if(containersIDs.indexOf(containerID) < 0) {
          appConfig.logger.info('delete container: ' + containerID);
          this.delete({container_name: containerID}).then(function(res) {
            return res;
          }).catch(function(err) {
            appConfig.logger.error(err.stack);
          });
        }
      }, this);

      return containers;
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  } else {
    return containers;
  }
};
