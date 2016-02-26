'use strict';

module.exports = FiltersController;

function FiltersController($scope, Container) {
  $scope.containers = Container.query(function() {
    $scope.selectedContainer = $scope.containers[0];
    console.log($scope.selectedContainer);
  });
}
