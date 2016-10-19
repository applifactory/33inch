app.controller('WebsiteDetailsVisibilityController', function($scope, $state, $stateParams, WebsitesService, Loader, $timeout) {

  var updatedTimeout = null;
  $scope.website = angular.copy($scope.$parent.website);
  WebsitesService.get($stateParams.link).then(function(website){
    $scope.website = website;
    $scope.$parent.website = angular.copy(website);
  });

  $scope.submitForm = function() {
    if ( $scope.isLoading ) {
      return;
    }
    $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      $scope.isLoading = true;
      $scope.updated = false;
      var update = {
        name: $scope.website.name,
        permalink: $scope.website.permalink,
        domain: $scope.website.domain,
        public: $scope.website.public
      };
      Loader.show('Saving...');
      WebsitesService.update($stateParams.link, update).then(function(){
        $scope.isLoading = false;
        $scope.$parent.website = angular.copy($scope.website);
        if ( $scope.$parent.permalink != $scope.website.permalink ) {
          $state.go('app.details.visibility', { link: $scope.website.permalink });
        }
        Loader.hide();
        $scope.updated = true;
        $timeout.cancel(updatedTimeout);
        updatedTimeout = $timeout(function(){
          $scope.updated = false;
        }, 2000);
      }, function(error){
        $scope.errorMessage = error.message;
        $scope.isLoading = false;
        Loader.hide();
      });
    }
  };

});
