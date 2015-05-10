app.directive('menuNav', function($timeout, Inch33ElementService, ElementsService, NodesService, $window){
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    template: '<li ng-repeat="node in nodes"><span ng-click="goTo(node)" style="color: {{ngModel.data.textColor}}">{{node.name}}</span></li>',
    controller: function($scope, SettingsService, $stateParams, $location){
      $scope.nodes = NodesService.currentNodes;
      $scope.link = $stateParams.link;
      $scope.goTo = function(node) {
        $location.path( '/app/' + $stateParams.link + ( node.link ? '/' + node.link : '' ) )
      }
    }
  }
})
