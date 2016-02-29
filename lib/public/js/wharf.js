'use strict';

var angular = require('angular')
  , FiltersController = require('./controllers/filters_controller')
  , ChartController = require('./controllers/chart_controller')
  , DashboardController = require('./controllers/dashboard_controller')
  , ChartDirective = require('./directives/chart_directive')
  , Container = require('./factories/container');

require('angular-ui-router');
require('angular-resource');

angular.module('wharf', ['ui.router', 'ngResource', 'wharf.controllers', 'wharf.directives', 'wharf.factories']);

angular.module('wharf').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('dashboard', {
                      abstract: true,
                      url: '/dashboard',
                      template: '<ui-view/>'
                    }).state('dashboard.details', {
                      url: '/details',
                      views: {
                        '': {
                          templateUrl: '/js/templates/dashboard.html',
                          controller: 'DashboardController as dashboardController'
                        },
                        'filters@dashboard.details': {
                          templateUrl: '/js/templates/dashboard/_filters.html',
                          controller: 'FiltersController as filtersController'
                        },
                        'chart@dashboard.details': {
                          templateUrl: '/js/templates/dashboard/_chart.html',
                          controller: 'ChartController as chartController'
                        }
                      }
                    });

  $urlRouterProvider.otherwise('/dashboard/details');
});

angular.module('wharf.factories', []);
angular.module('wharf.factories').factory('Container', ['$resource', Container]);

angular.module('wharf.directives', []);
angular.module('wharf.directives').directive('chart', [ChartDirective]);

angular.module('wharf.controllers', []);
angular.module('wharf.controllers').controller('DashboardController', ['$scope', DashboardController]);
angular.module('wharf.controllers').controller('FiltersController', ['$scope', FiltersController]);
angular.module('wharf.controllers').controller('ChartController', ['$scope', ChartController]);
