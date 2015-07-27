app.directive('menuNav', function($timeout, Inch33ElementService, ElementsService, NodesService, $window){
  return {
    restrict: 'A',
    scope: false,
    replace: true,
    template:
      '<ul ng-sortable="sortConfig">' +
        '<li ng-repeat="node in nodes track by $index">' +
          '<span ng-click="goTo(node)" style="color: {{ngModel.data.textColor}}">{{node.name}}</span>' +
        '</li>' +
      '</ul>',
    controller: function($scope, SettingsService, $stateParams, $location, NodesService, $rootScope){
      $scope.goTo = function(node) {
        $location.path( '/app/' + $stateParams.link + ( node.link ? '/' + node.link : '' ) )
      }
      $scope.sortConfig = {
        onSort: function (evt){
          NodesService.updatePositions($stateParams.link, $scope.nodes);
        }
      }
      $rootScope.$on('Nodes:reload', function(){
        NodesService.getNodes($stateParams.link).then(function(nodes){
          $scope.nodes = nodes;
        });
      })
    }
  }
})
