app.directive('fontFamily', function($compile){
  return {
    restrict: 'A',
    template: function(tElem, tAttrs){
      return '<div class="item" ng-class="{active: isFontActive(\''+tAttrs.fontFamily+'\') }" ng-click="setFontFamily(\''+tAttrs.fontFamily+'\')">' +
        '<ng-transclude></ng-transclude>' +
      '</div>';
    },
    replace: true,
    transclude: true,
    scope: false,
    link: function(scope, element, attr) {
      scope.isFontActive = function(fontFamily) {
        var _active = scope.data.style && scope.data.style.fontFamily == fontFamily;
        if ( _active ) {
          var previewEl = element[0].parentElement.parentElement.parentElement.querySelector('.selected-font');
          var selectedEl = element[0].parentElement.querySelector('.item.active ng-transclude');
          if ( selectedEl )
            previewEl.innerHTML = selectedEl.innerHTML;
        }
        return _active;
      }
      scope.setFontFamily = function(font) {
        scope.data.style.fontFamily = font;
      }
    }
  }
});
