app.directive('menuNav', function($timeout, Inch33ElementService, ElementsService, NodesService, $window){
  return {
    restrict: 'A',
    scope: false,
    replace: true,
    template: '<ul ng-sortable="sortConfig"><li ng-repeat="node in nodes track by $index"><span ng-click="goTo(node)" style="color: {{ngModel.data.textColor}}">{{node.name}}</span></li></ul>',
    controller: function($scope, SettingsService, $stateParams, $location){

      $scope.link = $stateParams.link;
      $scope.goTo = function(node) {
        $location.path( '/app/' + $stateParams.link + ( node.link ? '/' + node.link : '' ) )
      }
      $scope.sortConfig = {
        onSort: function (evt){
          //console.log('sort', evt);
          console.log($scope.nodes);
        }
      };
    }
  }
})
