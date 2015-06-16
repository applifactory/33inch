app.directive('toolsDropdown', function($timeout, Inch33ElementService, ElementsService){
  return {
    restrict: 'E',
    templateUrl: '/assets/app/website/tools-dropdown.html',
    scope: {
      ngModel: '=',
      config: '=',
      collection: '='
    },
    link: function(scope, element, attr) {
      scope.updateHeight = function(){
        $timeout(function(){
          element[0].querySelector('.viewport').style.height = ( element[0].querySelector('.view.active').offsetHeight + 10 ) + 'px';
        });
      }
      scope.$watch('currentView', function(view){
        scope.updateHeight();
      });
      angular.element(element[0].querySelector('.btn')).bind('click', function(e){
        element[0].classList.toggle('open');
      });
      angular.element(document).bind('click', function(event){
        if ( element.hasClass('open') ) {
          var e = event.target;
          while ( e && e.parentElement && e.parentElement != window ) {
            if ( e == element[0] )
              return;
            e = e.parentElement;
          }
          element[0].classList.remove('open');
        }
      });
      element.parent().bind('mouseout', function(event){
        var rel = this;
        var e = event.toElement || event.relatedTarget;
        while( e && e.parentNode && e.parentNode != window ) {
          if ( e.parentNode == rel ||  e == rel ) {
            return false;
          }
          e = e.parentNode;
        }
        scope.$apply(function(){
          if ( scope.currentView == 'new-bg-color' )
            scope.ngModel.data.style.backgroundColor = scope.lastColor;
          scope.showView('main');
          element[0].classList.remove('open');
        });
      });
    },
    controller: function($scope, SettingsService, $stateParams){

      $scope.moveUp = function() {
        ElementsService.moveUp($stateParams.link, $scope.ngModel._id, $scope.collection);
      }

      $scope.moveDown = function() {
        ElementsService.moveDown($stateParams.link, $scope.ngModel._id, $scope.collection);
      }

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
        $scope.ngModel.data.style.backgroundColor = color;
      }

      $scope.addColor = function(color) {
        if ( Inch33ElementService.colors.indexOf(color) < 0 ) {
          Inch33ElementService.colors.push(color);
        }
      }

      $scope.addColumnItem = function() {
        var item = {};
        angular.forEach($scope.config.elements, function(element){
          var _id = element.selector.replace(/[^a-z0-9]+/gi, ' ').trim().replace(/ /gi, '-');
          item[_id] = {text: element.name};
        });
        $scope.ngModel.data.columns.push(item);
      }

      $scope.uploadUrl = SettingsService.apiUrl + 'website/' + $scope.$parent.$parent.link + '/element/' + $scope.ngModel._id + '/image';

      $scope.bgUploadStart = function(files){

      }

      $scope.bgUploadSuccess = function(response){
        if ( !$scope.ngModel.hasOwnProperty('data') )
          $scope.ngModel.data = {};
        if ( !$scope.ngModel.data.hasOwnProperty('style') || !$scope.ngModel.data.style )
          $scope.ngModel.data.style = {};
        $scope.ngModel.data.style.backgroundImage = 'url(/fx/l-' + response.data.file + ')';
      }

      $scope.bgUploadError = function(response) {
        console.log('bgUploadError', response);
      }

      $scope.deleteBackground = function(image) {
        image = image.substr(10).replace(/\)/, '');
        ElementsService.deleteImage($scope.$parent.$parent.link, $scope.ngModel._id, image).then(function(){
          $scope.ngModel.data.style.backgroundImage = '';
          $scope.updateHeight();
        }, function(){
          $scope.ngModel.data.style.backgroundImage = '';
          $scope.updateHeight();
        });
      }

      $scope.backgroundPosition = function(position) {
        switch(position) {
          case 'top':
          case 'left':
          case 'right':
          case 'bottom':
            $scope.ngModel.data.style.backgroundSize = 'auto';
            $scope.ngModel.data.style.backgroundPosition = position;
            break;
          default:
            $scope.ngModel.data.style.backgroundSize = 'cover';
            $scope.ngModel.data.style.backgroundPosition = 'center';
        }
      }

      $scope.backgroundRepeat = function(repeat) {
        $scope.ngModel.data.style.backgroundRepeat = repeat;
      }

      $scope.deleteElement = function(id) {
        var index = -1;
        angular.forEach( $scope.collection, function(element, i){
          if ( element._id == id )
            index = i;
        });
        if ( index >= 0 ) {
          ElementsService.deleteElement($stateParams.link, id);
          $scope.collection.splice(index, 1);
        }
      }

    }
  }
})
