app.directive('toolsDropdown', function($timeout){
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
    },
    controller: function($scope){

      $scope.colors = ['#ffffff', '#F5F5F5', '#1D262D', '#C0A85A'];

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

    }
  }
})
