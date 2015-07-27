app.directive('menuDropdown', function($timeout, Inch33ElementService, ElementsService, $window, $stateParams){
  return {
    restrict: 'E',
    template:
      '<div class="toolbar">' +
        '<div class="btn" dropdown="/assets/app/website/editor/menu-dropdown.html" hide-on-unhover="true">' +
          '<i class="fa fa-ellipsis-h"></i>' +
        '</div>' +
      '</div>',
    scope: {
      ngModel: '=',
      config: '='
    },
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          if ( !scope.ngModel.hasOwnProperty('data') )
            scope.ngModel.data = {};
          if ( !scope.ngModel.data.hasOwnProperty('textColor') ) {
            console.log('textColor...');
            var _el = iElement[0].parentElement.querySelector('ul');
            if ( _el ) {
              scope.ngModel.data.textColor = $window.getComputedStyle(_el).getPropertyValue('color');
            }
          }
          Inch33ElementService.registerColor(scope.ngModel.data.textColor);
        }
      }
    },
    controller: function($scope, SettingsService, ElementsService){

      //  logo upload
      $scope.uploadUrl = SettingsService.apiUrl + 'website/' + $scope.$parent.$parent.link + '/element/' + $scope.ngModel._id + '/image';

      $scope.logoUploadStart = function(files) {
        $scope.isUploading = true;
      }

      $scope.logoUploadSuccess = function(response) {
        if ( $scope.ngModel.data.logoImage ) {
          var image = $scope.ngModel.data.logoImage.replace(/.+\//, '');
          ElementsService.deleteImage($scope.$parent.$parent.link, $scope.ngModel._id, image);
        }
        $scope.ngModel.data.logoImage = '/fx/s-' + response.data.file;
        $scope.isUploading = false;
      }

      $scope.logoUploadError = function(response) {
        $scope.isUploading = false;
      }

      //  dropdown events
      $scope.$on('dropdown:pop', function(event, name, view){
        if ( name == 'menuDropdown' && view == 'new-bg-color' ) {
          $scope.ngModel.data.style.backgroundColor = $scope.LastColor;
        }
        if ( name == 'menuDropdown' && view == 'new-color' ) {
          $scope.ngModel.data.textColor = $scope.LastColor;
        }
      });
      $scope.$on('dropdown:push', function(event, name, view){
        if ( name == 'menuDropdown' && view == 'new-bg-color' ) {
          $scope.LastColor = $scope.ngModel.data.style.backgroundColor;
        }
        if ( name == 'menuDropdown' && view == 'new-color' ) {
          $scope.LastColor = $scope.ngModel.data.textColor;
        }
      });
      $scope.$on('dropdown:close', function(event, name, view){
        if ( name == 'menuDropdown' && view == 'new-bg-color' ) {
          $scope.ngModel.data.style.backgroundColor = $scope.LastColor;
        }
        if ( name == 'menuDropdown' && view == 'new-color' ) {
          $scope.ngModel.data.textColor = $scope.LastColor;
        }
      });

      $scope.colors = Inch33ElementService.colors;

      //  background colors
      $scope.setBackgroundColor = function(color) {
        $scope.ngModel.data.style.backgroundColor = color;
        console.log( $scope.menuDropdown );
      }
      $scope.addBackgroundColor = function(color) {
        $scope.LastColor = $scope.ngModel.data.style.backgroundColor = color;
        Inch33ElementService.registerColor(color);
        $scope.menuDropdown.back();
      }

      //  font colors
      $scope.setColor = function(color) {
        $scope.ngModel.data.textColor = color;
      }
      $scope.addColor = function(color) {
        $scope.LastColor = $scope.ngModel.data.textColor = color;
        Inch33ElementService.registerColor(color);
        $scope.menuDropdown.back();
      }

      $scope.deleteElement = function(id) {
        console.log('deleteElement', $scope.$parent)
        var index = -1;
        angular.forEach( $scope.$parent.collection, function(element, i){
          if ( element._id == id )
            index = i;
        });
        if ( index >= 0 ) {
          ElementsService.deleteElement($stateParams.link, id);
          $scope.$parent.collection.splice(index, 1);
        }
      }

      //  new item
      $scope.addNode = function() {
        $scope.$parent.editNode();
      }

    }
  }
})
