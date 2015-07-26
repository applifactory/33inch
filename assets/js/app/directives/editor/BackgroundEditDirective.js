app.directive("backgroundEdit", function($timeout, $window, $compile, SettingsService, ElementsService) {
  return {
    restrict: "A",
    require: "ngModel",
    scope: {
      style: '=ngModel',
      link: '@',
      elementId: '@'
    },
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          if ( !scope.hasOwnProperty('style') || !scope.style )
            scope.style = {};
          if ( !scope.style.hasOwnProperty('backgroundImage') )
            scope.style.backgroundImage = $window.getComputedStyle(iElement[0]).getPropertyValue('background-image');
          var tools = iElement[0].querySelector('.tools');
          if ( !tools ) {
            tools = document.createElement('div');
            tools.classList.add('tools');
            iElement[0].appendChild(tools);
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
        if ( $scope.style.backgroundImage )
          $scope.deleteBackground();
        $scope.style.backgroundImage = 'url(/fx/l-' + response.data.file + ')';
      }
      $scope.deleteBackground = function() {
        var image = $scope.style.backgroundImage.substr(10).replace(/\)/, '');
        ElementsService.deleteImage($scope.link, $scope.elementId, image);
      }
    }
  };
});
