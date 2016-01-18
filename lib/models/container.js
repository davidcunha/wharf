'use strict';

var SQliteORM = require('services/sqlite_orm');

var Container = function(){
  SQliteORM.call(this, 'containers');
};

Container.prototype = Object.create(SQliteORM.prototype);

module.exports = Container;
