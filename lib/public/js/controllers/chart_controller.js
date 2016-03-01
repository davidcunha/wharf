'use strict';

module.exports = ChartController;

function ChartController($scope) {
  var chartsType = $scope.$parent.chartsType;

  if(chartsType === undefined || chartsType === null) {
    throw new Error('Dashboard chartsType is empty or does not exists');
  }

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
            },
            {
                label: 'My Second dataset',
                fillColor: 'rgba(151,187,205,0.2)',
                strokeColor: 'rgba(151,187,205,1)',
                pointColor: 'rgba(151,187,205,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(151,187,205,1)',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
  };

  /* there is one chart per metric, this will
  *  associate each chart controller with a chart type
  *  by setting the type in the controller scope if not already enabled
  */
  chartsType.every(function(chart, index) {
    if(chart.enabled === false) {
      chartsType[index].enabled = true;
      $scope.type = chart.type;
      return false;
    }
    return true;
  });
}
