app.directive('colorPicker', function($window){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      color: '=ngModel'
    },
    template:
      '<div class="color-picker">' +
        '<div class="color" style="background: {{bgColor}}">' +
          '<div class="sat"></div>' +
          '<div class="light"></div>' +
          '<div class="select" style="left: {{sat*100}}%; top: {{100-light*100}}%"></div>' +
          '<div class="overlay" ng-class="{active: mode==\'color\'}"></div>' +
        '</div>' +
        '<div class="hue">' +
          '<div class="select" style="top: {{hue*100}}%"></div>' +
          '<div class="overlay" ng-class="{active: mode==\'hue\'}"></div>' +
        '</div>' +
        '<div class="alpha">' +
          '<div class="light"></div>' +
          '<div class="select" style="left: {{alpha*100}}%"></div>' +
          '<div class="overlay" ng-class="{active: mode==\'alpha\'}"></div>' +
        '</div>' +
        '<div class="preview">' +
          '<div class="overlay left" style="background: {{newColor}}"></div>' +
          '<div class="overlay right" style="background: {{color}}"></div>' +
        '</div>' +
      '</div>',
    link: function(scope, element, attrs){

      scope.hue = 0.5;
      scope.sat = 0.5;
      scope.light = 0.5;
      scope.alpha = 1;
      scope.bgColor = '#000000';
      scope.newColor = '#000000';
      scope.mode = null;

      scope.$watch('color', function(color){
        if ( color != scope.newColor ) {
          var _color = tinycolor(color).toHsl();
          scope.hue = _color.h / 360;
          scope.sat = _color.s;
          scope.light = _color.l / ( 1 - scope.sat/2 );
          scope.alpha = _color.a;
          updateColors();
        }
      });

      var updateColors = function() {
        scope.bgColor = tinycolor({ h: scope.hue * 360, s: 1, l: 0.5 }).toHexString();
        scope.newColor = tinycolor({ h: scope.hue * 360, s: scope.sat, l: scope.light * ( 1 - scope.sat/2 ), a: scope.alpha }).toRgbString();
      }

      angular.element(document.body).bind('mouseup', function(e){
        if ( scope.mode != null ) {
          scope.$apply(function(){
            scope.mode = null;
            console.log(scope.color);
            scope.color = scope.newColor;
          });
        }
      });

      var hueSelect = angular.element( element[0].querySelector('.hue .overlay') );
      hueSelect.bind('mousedown mousemove', function(e){
        if ( e.type == 'mousedown' )
          scope.mode = 'hue';
        if ( e.which == 1 && scope.mode == 'hue' ) {
          e.preventDefault();
          var offset = e.target.classList.contains('active') ? 20 : 0;
          var x, y;
          if ( e.offsetX || e.offsetY ) {
            x = e.offsetX;
            y = e.offsetY;
          } else {
            x = e.layerX;
            y = e.layerY;
          }
          scope.hue = Math.max( Math.min( ( y - offset ) / ( e.currentTarget.offsetHeight - 2 * offset ), 1 ), 0 );
          $window.getSelection().removeAllRanges();
          updateColors();
          scope.$apply();
        }
      });

      var colorSelect = angular.element( element[0].querySelector('.color .overlay') );
      colorSelect.bind('mousedown mousemove', function(e){
        if ( e.type == 'mousedown' )
          scope.mode = 'color';
        if ( e.which == 1 && scope.mode == 'color' ) {
          e.preventDefault();
          var offset = e.target.classList.contains('active') ? 20 : 0;
          var x, y;
          if ( e.offsetX || e.offsetY ) {
            x = e.offsetX;
            y = e.offsetY;
          } else {
            x = e.layerX;
            y = e.layerY;
          }
          scope.sat = Math.max( Math.min( ( x - offset ) / ( e.currentTarget.offsetWidth - 2 * offset ), 1 ), 0 );
          scope.light = 1 - Math.max( Math.min( ( y - offset ) / ( e.currentTarget.offsetHeight - 2 * offset ), 1 ), 0 );
          $window.getSelection().removeAllRanges();
          updateColors();
          scope.$apply();
        }
      });

      var alphaSelect = angular.element( element[0].querySelector('.alpha .overlay') );
      alphaSelect.bind('mousedown mousemove', function(e){
        if ( e.type == 'mousedown' )
          scope.mode = 'alpha';
        if ( e.which == 1 && scope.mode == 'alpha' ) {
          e.preventDefault();
          var offset = e.target.classList.contains('active') ? 20 : 0;
          var x, y;
          if ( e.offsetX || e.offsetY ) {
            x = e.offsetX;
            y = e.offsetY;
          } else {
            x = e.layerX;
            y = e.layerY;
          }
          scope.alpha = Math.max( Math.min( ( x - offset ) / ( e.currentTarget.offsetWidth - 2 * offset ), 1 ), 0 );
          $window.getSelection().removeAllRanges();
          updateColors();
          scope.$apply();
        }
      });

      updateColors();
    }
  }
})
