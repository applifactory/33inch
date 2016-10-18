app.controller('WebsiteDetailsVisibilityController', function(website, $scope, $state, $stateParams, WebsitesService, Loader) {

  $scope.website = angular.copy(website);

  $scope.submitForm = function() {
    if ( $scope.isLoading ) {
      return;
    }
    $scope.isLoading = true;
    $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      var update = {
        name: $scope.website.name,
        permalink: $scope.website.permalink,
        domain: $scope.website.domain,
        public: $scope.website.public
      };
      $scope.isLoading = true;
      Loader.show();
      WebsitesService.update($stateParams.link, update).then(function(){
        $scope.isLoading = false;
        $scope.$parent.website = angular.copy($scope.website);
        if ( $scope.$parent.permalink != $scope.website.permalink ) {
          $state.go('app.details.visibility', { link: $scope.website.permalink });
        }
        Loader.hide();
      }, function(error){
        $scope.errorMessage = error.message;
        $scope.isLoading = false;
        Loader.hide();
      });
    }
  };

});
