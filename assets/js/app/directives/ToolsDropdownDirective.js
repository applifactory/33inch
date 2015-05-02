app.directive('toolsDropdown', function($timeout, Inch33ElementService){
  return {
    restrict: 'E',
    templateUrl: '/assets/app/website/tools-dropdown.html',
    scope: {
      data: '=ngModel',
      config: '='
    },
    link: function(scope, element, attr) {
      scope.$watch('currentView', function(view){
        $timeout(function(){
          element[0].querySelector('.viewport').style.height = ( element[0].querySelector('.view.active').offsetHeight + 10 ) + 'px';
        });
      });
      scope.$watch('data', function(data){
        console.log('data:', data);
      }, true);
      angular.element(element[0].querySelector('.btn')).bind('click', function(e){
        element[0].classList.toggle('open');
      });
      element.parent().bind('mouseout click', function(event){
        var rel = event.type == 'mouseout' ? this : element[0];
        var e = event.toElement || event.relatedTarget;
        while( e && e.parentNode && e.parentNode != window ) {
          if ( e.parentNode == rel ||  e == rel ) {
            return false;
          }
          e = e.parentNode;
        }
        scope.$apply(function(){
          if ( scope.currentView == 'new-bg-color' )
            scope.data.style.backgroundColor = scope.lastColor;
          scope.showView('main');
          element[0].classList.remove('open');
        });
      });
    },
    controller: function($scope){

      $scope.colors = Inch33ElementService.colors;

      $scope.hasElements = false;
      $scope.hasAppearance = false;
      if ( $scope.config.elements ) {
        $scope.config.elements.forEach(function(element){
          $scope.hasElements = $scope.hasElements || ( element.hasOwnProperty('elements') );
          $scope.hasAppearance = $scope.hasAppearance || ( element.hasOwnProperty('appearance') && element.appearance );
        });
      }
      $scope.currentView = 'main';
      $scope.showView = function(view) {
        $scope.currentView = view;
      }

      $scope.setBackgroundColor = function(color) {
        $scope.data.style.backgroundColor = color;
      }

      $scope.addColor = function(color) {
        if ( Inch33ElementService.colors.indexOf(color) < 0 ) {
          Inch33ElementService.colors.push(color);
        }
      }

    }
  }
})
