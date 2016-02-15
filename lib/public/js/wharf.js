'use strict';

var angular
  , DashboardController
  , FiltersController
  , ChartController;

angular.module('wharf', ['ui.router', 'wharf.controllers']);

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

  $urlRouterProvider.otherwise('/');
});

angular.module('wharf.controllers', []);
angular.module('wharf.controllers').controller('DashboardController', DashboardController);
angular.module('wharf.controllers').controller('FiltersController', FiltersController);
angular.module('wharf.controllers').controller('ChartController', ChartController);
