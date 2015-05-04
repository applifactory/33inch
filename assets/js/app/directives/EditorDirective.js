app.directive("editor", function($timeout, $window, Inch33ElementService) {
  return {
    restrict: "E",
    require: "ngModel",
    scope: {
      data: '=ngModel'
    },
    transclude: true,
    templateUrl: '/assets/app/website/editor/editor.html',
    controller: function($scope) {
      $scope.colors = Inch33ElementService.colors;

      $scope.aaa = 'qwdqwdqwd';
      $scope.setColor = function(color) {
        $scope.data.style.color = color;
      }
      $scope.setTextAlign = function(align) {
        $scope.data.style.textAlign = align;
      }
    },
    link: function(scope, element, attrs, ngModel) {
      $timeout(function(){
        var el = element[0].querySelector('ng-transclude > *');
        if ( !scope.data.style )
          scope.data.style = {};
        if ( !scope.data.style.textAlign )
          scope.data.style.textAlign = $window.getComputedStyle(el).getPropertyValue('text-align').replace('start', 'left');
        if ( !scope.data.style.color )
          scope.data.style.color = tinycolor($window.getComputedStyle(el).getPropertyValue('color')).toHexString();
        console.log('color: ', scope.data.style.color);
      });
    }
  };
});
