app.directive("imageEdit", function($timeout, $window, $compile, SettingsService, ElementsService) {
  return {
    restrict: "A",
    require: "ngModel",
    scope: {
      image: '=ngModel',
      link: '@',
      elementId: '@'
    },
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          if ( !scope.hasOwnProperty('image') || !scope.image )
            scope.image = iElement.attr('src');
          var parent = iElement.parent().parent()[0];
          var tools = parent.querySelector('.tools');
          if ( !tools ) {
            tools = document.createElement('div');
            tools.classList.add('tools');
            parent.appendChild(tools);
            $compile(tools)(scope);
          } else
            console.log('tools exists');
          var button = document.createElement('div');
          button.classList.add('btn');
          button.setAttribute('upload-button', '');
          button.setAttribute('url', SettingsService.apiUrl + 'website/' + iAttrs.link + '/element/' + iAttrs.elementId + '/image');
          button.setAttribute('param', 'file');
          button.setAttribute('on-upload', 'uploadStart(files)');
          button.setAttribute('on-success', 'uploadSuccess(response)');
          button.innerHTML = '<i class="fa fa-picture-o"></i>';
          tools.appendChild(button);
          $compile(button)(scope);
        }
      }
    },
    controller: function($scope) {
      $scope.uploadStart = function(files){

      }
      $scope.uploadSuccess = function(response){
        if ( $scope.image )
          $scope.deleteImage();
        $scope.image = '/fx/c-' + response.data.file;
      }
      $scope.deleteImage = function() {
        var image = $scope.image.substr(6);
        ElementsService.deleteImage($scope.link, $scope.elementId, image);
      }
    }
  };
});
