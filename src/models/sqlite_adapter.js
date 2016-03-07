'use strict';

module.exports = SQliteAdapter;

var sqlite3 = require('sqlite3').verbose()
  , appConfig = require('../config/application')
  , db = new sqlite3.cached.Database('./db/' + appConfig.database + '.sqlite')
  , Q = require('q');

/**
 * SQliteAdapter.
 * ORM for SQlite3.
 * Used by delegation from all models that maps to a SQL table.
 *
 * @Function
 * @this {SQliteAdapter}
 * @return {SQliteAdapter} The new SQliteAdapter object
 * @throws {Error} Will throw an error if modelName is undefined
 * @throws {Error} Will throw an error if tableName is undefined
 * @throws {Error} Will throw an error if schemaAttrs is undefined
 */
function SQliteAdapter(options) {
  options = options || {};
  if(!options.modelName) { throw new Error('\'modelName\' is undefined'); }
  if(!options.tableName) { throw new Error('\'tableName\' is undefined'); }
  if(!options.schemaAttrs) { throw new Error('\'schemaAttrs\' is undefined'); }

  return {
    modelName: options.modelName,
    tableName: options.tableName,
    schemaAttrs: options.schemaAttrs,
    associations: options.associations,
    create: create,
    destroy: destroy,
    find: find,
    findAll: findAll,
    update: update
  };
}

/**
 * Creates a new model.
 *
 * @this {SQliteAdapter}
 * @param {Object} insertAttrs - insert attributes for model
 * @return {Promise} A promise to the create result
 */
var create = function create(insertAttrs) {
  insertAttrs = insertAttrs || {};

  validateAttrs.call(this, [insertAttrs]);

  var insertStmt = insertStatement(insertAttrs);
  return exec('INSERT INTO ' + this.tableName + ' ' + insertStmt).then(function(res) {
    return res;
  });
};

/**
 * Destroy a model.
 *
 * @this {SQliteAdapter}
 * @param {Object} selectAttrs - select attributes for model
 * @return {Promise} A promise to the destroy result
 */
var destroy = function(selectAttrs) {
  selectAttrs = selectAttrs || {};

  validateAttrs.call(this, [selectAttrs]);

  var selectStmt = selectStatement(selectAttrs);
  return exec('DELETE FROM ' + this.tableName + ' ' + selectStmt).then(function(res) {
    return res;
  });
};

/**
 * Find a model.
 *
 * @this {SQliteAdapter}
 * @param {Object} - select attributes for model
 * @param {Array|undefined} - projection attributes for model or an empty parameter
 * @return {Promise} A promise to the find result
 */
var find = function(selectAttrs, projectionAttrs) {
  selectAttrs = selectAttrs || {};
  projectionAttrs = projectionAttrs || [];

  validateAttrs.call(this, [selectAttrs, projectionAttrs]);

  var selectStmt = selectStatement(selectAttrs);
  var projectionStmt = projectionStatement(projectionAttrs);
  return all('SELECT ' + projectionStmt + ' FROM ' + this.tableName + ' ' + selectStmt + ' LIMIT 1').then(function(model) {
    return model;
  });
};

/**
 * Find all models.
 *
 * @this {SQliteAdapter}
 * @param {Object|Array} - select or projection attributes for models
 * @param {Array|null} - projection attributes for models or empty parameter
 * @return {Promise} A promise to the findAll result
 */
var findAll = function(attrs, projectionAttrs) {
  /**
   * Query for all without selection, or use projection if sent as first parameter
   */
  if((attrs === undefined || attrs === null) || Array.isArray(attrs)) {
    projectionAttrs = attrs || [];

    validateAttrs.call(this, [projectionAttrs]);

    return all('SELECT ' + projectionStatement(projectionAttrs) + ' FROM ' + this.tableName).then(function(models) {
      return models;
    });

  /**
   * Query for all with selection, and use projectionAttrs if present
   */
  } else {
    attrs = attrs || {};
    projectionAttrs = projectionAttrs || [];

    validateAttrs.call(this, [attrs, projectionAttrs]);
    var selectStmt = selectStatement(attrs);

    return all('SELECT ' + projectionStatement(projectionAttrs) + ' FROM ' + this.tableName + ' ' + selectStmt).then(function(models) {
      return models;
    });
  }
};

/**
 * Updates model.
 *
 * @this {SQliteAdapter}
 * @param {Object} selectAttrs - select attributes for model
 * @param {Object} updateAttrs - update attributes for model
 * @return {Promise} A promise to the update result
 */
var update = function(selectAttrs, updateAttrs) {
  selectAttrs = selectAttrs || {};
  updateAttrs = updateAttrs || {};

  validateAttrs.call(this, [selectAttrs, updateAttrs]);

  var updateSmt = updateStatement(selectAttrs, updateAttrs);
  return exec('UPDATE ' + this.tableName + ' SET ' + updateSmt).then(function(res) {
    return res;
  });
};

/**
* Validates attributes to be used in SQL query.
*
* @private
* @this {SQliteAdapter}
* @param {Object} attrs - attributes to be validated
* @throws {Error} Will throw an error if attributes are invalid
*/
var validateAttrs = function(attrs) {
  var valid = false;
  var invalidAttrs;

  if (attrs !== undefined && attrs !== null) {
    attrs.forEach(function(setOfAttrs) {
      if(!Array.isArray(setOfAttrs)) {
        setOfAttrs = Object.keys(setOfAttrs);
      }
      invalidAttrs = setOfAttrs.filter(function(attr) {
        return this.schemaAttrs.indexOf(attr) < 0;
      }, this);
      valid = (invalidAttrs.length === 0) ? true : false;
    }, this);
  }

  if(!valid) {
    appConfig.logger.error('Invalid attributes: ', attrs);
    throw new Error('Invalid attributes: ' + attrs);
  }
};

/**
* Creates projection statement for SQL query.
*
* @private
* @param {Array} projectionAttrs - projection attributes for query
* @return {String} Projection statement
*/
function projectionStatement(projectionAttrs) {
  projectionAttrs = projectionAttrs || [];
  if(projectionAttrs.length > 0) {
    return projectionAttrs.join(',');
  } else {
    return '*';
  }
}

/**
* Creates insertion statement for SQL query.
*
* @private
* @param {Object} insertAttrs - insert attributes for query
* @return {String} Insertion string
*/
function insertStatement(insertAttrs) {
  var columns = [];
  var values  = [];
  Object.keys(insertAttrs).forEach(function(attr) {
    columns.push(attr);
    values.push(insertAttrs[attr]);
  });
  return '(' + columns.join(',') + ') VALUES (\'' + values.join('\',\'') + '\')';
}

/**
* Creates select statement for SQL query.
*
* @private
* @param {Object} selectAttrs - select attributes for query
* @return {String} Select statement
*/
function selectStatement(selectAttrs) {
  selectAttrs = Object.keys(selectAttrs).map(function(attr) {
    // attribute is an SQL operator
    if(selectAttrs[attr] instanceof Object) {
      var operator = Object.keys(selectAttrs[attr])[0];
      var operatorPredicate = selectAttrs[attr][operator];

      if(Array.isArray(operatorPredicate)) {
        if(operator === 'between') {
          return (attr + ' BETWEEN ' + '\'' + operatorPredicate[0] + '\'' +
                            ' AND ' + '\'' + operatorPredicate[1] + '\'');
        }
      } else {
        return (attr + ' ' + operator + ' \'' + selectAttrs[attr] + '\'');
      }

    } else {
      return (attr + ' = ' + '\'' + selectAttrs[attr] + '\'');
    }
  }).join(' AND ');
  return 'WHERE ' + selectAttrs;
}

/**
* Creates update statement for SQL query.
*
* @private
* @param {Object} selectAttrs - select attributes for query
* @param {Object} updateAttrs - update attributes for query
* @return {String} Update statament
*/
function updateStatement(selectAttrs, updateAttrs) {
  selectAttrs = selectStatement(selectAttrs);
  updateAttrs = Object.keys(updateAttrs).map(function(attr) {
    return (attr + ' = ' + '\'' + updateAttrs[attr] + '\'');
  }).join(',');
  return updateAttrs + ' ' + selectAttrs;
}

/**
* Runs query to get all result rows.
*
* @private
* @param {String} query - query
* @return {Promise} A promise to the all result
*/
function all(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      appConfig.logger.info(new Date().toISOString(), query);
      db.all(query, function(err, models) {
        if(err) reject(err);
        resolve(models);
      });
    });
  });
}

/**
* Runs query and no result rows are retrieved.
*
* @private
* @param {String} query - query
* @return {Promise} A promise to the exec result
*/
function exec(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      appConfig.logger.info(new Date().toISOString(), query);
      db.exec(query, function(err, _) {
        if(err) reject(err);
        resolve(_);
      });
    });
  });
}

/**
* Creates database.
*
* @private
* @return {Promise} A promise to the createDB result
*/
SQliteAdapter.createDB = function() {
  var schema = appConfig.schema;
  return exec(schema).then(function(res) {
    return res;
  }).catch(function(err) {
    appConfig.logger.error(err.stack);
  });
};

/**
* Deletes database.
*
* @private
* @return {Promise} A promise to the deleteDB result.
*/
SQliteAdapter.deleteDB = function() {
  return all('SELECT name FROM sqlite_master WHERE type=\'table\'').then(function(tables) {
    return tables.filter(function(table) {
      if(table.name !== 'sqlite_sequence')
        return table;
    });
  }).then(function(tables) {
    return tables.forEach(function(table) {
      exec('DELETE FROM ' + table.name).then(function(res) {
        return res;
      });
    });
  }).then(function() {
    return exec('VACUUM').then(function(res) {
      return res;
    });
  }).catch(function(err) {
    appConfig.logger.error(err.stack);
  });
};
