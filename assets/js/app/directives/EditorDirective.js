app.directive("editor", function($timeout, $window, Inch33ElementService, $rootScope) {
  return {
    restrict: "E",
    require: "ngModel",
    scope: {
      data: '=ngModel'
    },
    transclude: true,
    templateUrl: '/assets/app/website/editor/editor.html',
    controller: function($scope) {

      //  text align
      $scope.setTextAlign = function(align) {
        $scope.data.style.textAlign = align;
      }

      //  text color
      $scope.colors = Inch33ElementService.colors;
      $scope.setColor = function(color) {
        $scope.data.style.color = color;
      }
      $scope.addColor = function(color) {
        Inch33ElementService.registerColor(color);
        $scope.lastColor = $scope.data.style.color = color;
        $scope.colorsDropdown.back();
      }
      $scope.$on('dropdown:close', function(e, name, view){
        if ( name == 'colorsDropdown' && view == 'new-color' ) {
          $scope.data.style.color = $scope.lastColor;
          $scope.$apply();
        }
      });
      $scope.$on('dropdown:pop', function(e, name, view){
        if ( name == 'colorsDropdown' && view == 'new-color' )
          $scope.data.style.color = $scope.lastColor;
      });

      //  font size
      $scope.$watch('fontSize', function(size){
        if ( $scope.data && size )
          $scope.data.style.fontSize = size + 'px';
      });

      //  line height
      $scope.$watch('lineHeight', function(size){
        if ( $scope.data && size )
          $scope.data.style.fontSize = size + 'px';
      });

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
        if ( !scope.data.style.fontFamily )
          scope.data.style.fontFamily = $window.getComputedStyle(el).getPropertyValue('font-family');
        if ( !scope.data.style.fontSize )
          scope.data.style.fontSize = $window.getComputedStyle(el).getPropertyValue('font-size');
        scope.fontSize = parseInt(scope.data.style.fontSize);
        if ( !scope.data.style.lineHeight ) {
          scope.data.style.lineHeight = $window.getComputedStyle(el).getPropertyValue('line-height');
          if ( scope.data.style.lineHeight == 'normal' )
            scope.data.style.lineHeight = 1.5;
          else
            scope.data.style.lineHeight = Math.round(parseInt(scope.data.style.lineHeight) / scope.fontSize * 10) / 10;
        }

        angular.element(element[0].querySelector('[contenteditable]')).bind('focus', function(){
          element.addClass('focus');
          scope.$emit('editor:focus');
        });

        $rootScope.$on('editor:focus', function(e){
          if ( e.targetScope != scope ) {
            element.removeClass('focus');
          }
        });

        angular.element(document).bind('click', function(event){
          if ( element.hasClass('focus') ) {
            var e = event.target;
            while ( e && e.parentElement && e.parentElement != window ) {
              if ( e == element[0] ) {
                return;
              }
              e = e.parentElement;
            }
            element.removeClass('focus');
          }
        });

      });
    }
  };
});
