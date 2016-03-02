'use strict';

module.exports = DashboardController;

function DashboardController($scope) {
  $scope.dashboard = 'dashboard';
  $scope.chartsType = [{type: 'memory', enabled: false},
                    {type: 'cpu', enabled: false},
                    {type: 'network', enabled: false}];
}
