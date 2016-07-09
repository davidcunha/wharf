'use strict';

module.exports = DashboardController;

function DashboardController($scope, Container) {
  console.log(Container);
  // $scope.containers = Container.query(function() {
  //   $scope.selectedContainer = $scope.containers[0];
  // });

  $scope.containers = [{
    container_name: '999f3c428c18b71982100b8e1a2f26535c2b1f855bc2db4bc01bdf65f076d26f', container_alias: 'mongo'
  }];

  $scope.selectedContainer = $scope.containers[0];
  $scope.selectedContainerName = $scope.selectedContainer.container_name;

  $scope.chartsType = [{type: 'memory', enabled: false},
                    {type: 'cpu', enabled: false},
                    {type: 'network', enabled: false}];
}
