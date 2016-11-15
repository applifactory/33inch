app.controller('WebsiteDetailsSettingsController', function($scope, $state, $stateParams, WebsitesService, Loader, $timeout) {

  var updatedTimeout = null;
  $scope.website = angular.copy($scope.$parent.website);
  WebsitesService.get($stateParams.link).then(function(website){
    $scope.website = website;
    $scope.$parent.website = angular.copy(website);
  });

  $scope.reset = function() {
    $scope.website = angular.copy($scope.$parent.website);
    $scope.form.$setPristine();
  };

  $scope.submitForm = function() {
    if ( $scope.isLoading ) {
      return;
    }
    $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      $scope.isLoading = true;
      $scope.updated = false;
      var update = {
        email: $scope.website.email,
        analytics: $scope.website.analytics,
        customScript: $scope.website.customScript
      };
      Loader.show('Saving...');
      WebsitesService.update($stateParams.link, update).then(function(){
        $scope.isLoading = false;
        $scope.$parent.website = angular.copy($scope.website);
        $scope.form.$setPristine();
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
