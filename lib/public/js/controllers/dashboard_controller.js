'use strict';

module.exports = DashboardController;

function DashboardController($scope) {
  $scope.dashboard = 'dashboard';
  $scope.charts = [{type: 'memory', enabled: false},
                  {type: 'cpu', enabled: false},
                  {type: 'network', enabled: false}];
}
