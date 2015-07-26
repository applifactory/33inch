app.directive("attachementEdit", function($timeout, $window, $compile, SettingsService, ElementsService) {
  return {
    restrict: "A",
    scope: {
      attachement: '=attachementEdit',
      link: '@',
      elementId: '@'
    },
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          var tools = iElement[0].querySelector('.tools');
          if ( !tools ) {
            tools = document.createElement('div');
            tools.classList.add('tools');
            iElement[0].appendChild(tools);
            $compile(tools)(scope);
          }
          var button = document.createElement('div');
          button.classList.add('btn');
          button.setAttribute('upload-button', '');
          button.setAttribute('url', SettingsService.apiUrl + 'website/' + iAttrs.link + '/element/' + iAttrs.elementId + '/file');
          button.setAttribute('param', 'file');
          button.setAttribute('on-upload', 'uploadStart(files)');
          button.setAttribute('on-success', 'uploadSuccess(response)');
          button.setAttribute('on-error', 'uploadError(response)');
          button.setAttribute('ng-class', '{loading: isUploading}');
          button.innerHTML = '<i class="fa fa-file"></i><i class="fa fa-spinner fa-spin"></i>';
          tools.appendChild(button);
          $compile(button)(scope);

          button = document.createElement('div');
          button.classList.add('btn');
          button.setAttribute('ng-click', 'download(attachement)');
          button.setAttribute('ng-if', 'attachement');
          button.innerHTML = '<i class="fa fa-arrow-circle-down"></i>';
          tools.appendChild(button);
          $compile(button)(scope);
        }
      }
    },
    controller: function($scope) {
      $scope.uploadStart = function(files){
        $scope.isUploading = true;
      }
      $scope.uploadSuccess = function(response){
        if ( $scope.attachement )
          $scope.deleteAttachement();
        $scope.isUploading = false;
        $scope.attachement = '/fx/' + response.data.file;
      }
      $scope.uploadError = function() {
        $scope.isUploading = false;
      }
      $scope.deleteAttachement = function() {
        var file = $scope.attachement.substr(4).replace(/\)/, '');
        ElementsService.deleteFile($scope.link, $scope.elementId, file);
      }
      $scope.download = function(attachement) {
        window.open(attachement);
      }
    }
  };
});
