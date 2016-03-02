'use strict';

module.exports = ChartController;

function ChartController($scope) {
  var chartsType = $scope.$parent.chartsType;

  if(chartsType === undefined || chartsType === null) {
    throw new Error('Dashboard chartsType is empty or does not exists');
  }

  /**
   * There is one chart per metric
   * This will associate each chart type with a controller,
   * if type is not already associated
  */
  chartsType.every(function(chart, index) {
    if(chart.enabled === false) {
      chartsType[index].enabled = true;
      $scope.type = chart.type;
      return false;
    }
    return true;
  });

  $scope.dataSource = function() {
    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: [65, 59, 80, 81, 56, 55, 40]
        }
      ]
    };
  };
}
