'use strict';

module.exports = FiltersController;

function FiltersController($scope) {
  // $scope.containers = Container.query(function() {
  //   $scope.selectedContainer = $scope.containers[0];
  //   console.log($scope.selectedContainer);
  // });

  $scope.containers = [{
    container_name: '999999', container_alias: 'mongo'
  }];

  $scope.selectedContainer = $scope.containers[0];
}
