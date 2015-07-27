app.directive('menuNav', function($timeout, Inch33ElementService, ElementsService, NodesService, $window){
  return {
    restrict: 'A',
    scope: false,
    replace: true,
    template:
      '<ul ng-sortable="sortConfig">' +
        '<li ng-repeat="node in nodes track by $index">' +
          '<span ng-click="goTo(node)" style="color: {{ngModel.data.textColor}}">{{node.name}}</span>' +
          '<div class="tools" ng-if="!node.softLink">' +
            '<i class="fa fa-pencil" ng-click="editNode(node)"></i>' +
            '<i class="fa fa-ban" click-confirm="deleteNode(node)" confirm="Are you sure you want to delete <strong>{{node.name}}</strong>?"></i>' +
          '</div>' +
        '</li>' +
      '</ul>',
    controller: function($scope, SettingsService, $stateParams, $location, NodesService, $rootScope, ngDialog){
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
      $scope.editNode = function(node) {
        $scope.currentNode = node ? angular.copy(node) : { name: '' };
        $scope.nodeDialog = ngDialog.open({
          template:
            '<div class="ui-kit">' +
              '<label>' +
                'Item name' +
                '<input type="text" ng-model="currentNode.name"/>' +
              '</label>' +
              '<div class="actions">' +
                '<span class="button fill small" ng-click="closeThisDialog()">Cancel</span>' +
                '<span class="button fill primary small" ng-click="saveNode()">Save</span>' +
              '</div>' +
            '</div>',
          plain: true,
          scope: $scope
        })
      }
      $scope.saveNode = function() {
        if ( $scope.currentNode.name ) {
          console.log('saveNode');
          if ( $scope.currentNode._id ) {
            NodesService.update($stateParams.link, $scope.currentNode).then(function(){
              $rootScope.$emit('Nodes:reload');
            });
          } else {
            NodesService.create($stateParams.link, $scope.currentNode).then(function(){
              $rootScope.$emit('Nodes:reload');
            });
          }
          $scope.nodeDialog.close();
        }
      }
      $scope.deleteNode = function(node) {
        NodesService.delete($stateParams.link, node).then(function(){
          $rootScope.$emit('Nodes:reload');
        });
      }
    }
  }
})
