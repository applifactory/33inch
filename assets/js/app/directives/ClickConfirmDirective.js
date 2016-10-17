app.directive('clickConfirm', function(ngDialog){
  return {
    restrict: 'A',
    scope: {
      callback: '&clickConfirm',
      confirm: '@'
    },
    link: function(scope, elem) {
      elem.bind('click', function(){
        scope.$apply(function(){
          scope.open();
        });
      });
    },
    controller: function($scope) {
      var confirmation = $scope.confirm;
      var dialog = null;

      $scope.yesCallback = function() {
        dialog.close();
        $scope.callback();
      };

      $scope.noCallback = function() {
        dialog.close();
      };

      $scope.open = function() {
        dialog = ngDialog.open({
          template:
            '<div class="ui-kit">' +
              '<p>' + confirmation + '</p>' +
              '<div class="actions">' +
                '<div class="button small fill primary" ng-click="yesCallback()">Yes</div>' +
                '<div class="button small fill " ng-click="noCallback()">No</div>' +
              '</div>' +
            '</div>',
          plain: true,
          scope: $scope
        });
      };

    }
  };
});
