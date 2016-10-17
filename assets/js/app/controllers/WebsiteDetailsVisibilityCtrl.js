app.controller('WebsiteDetailsVisibilityController', function(website, $scope, $stateParams, WebsitesService) {

  $scope.website = angular.copy(website);

  $scope.submitForm = function() {
    console.log('submitForm', $scope.form);
    if ( $scope.form.$valid ) {
      // WebsitesService
    }
  };

  console.log(website);
  // $scope.getWebsite = function(){
  //   WebsitesService.getWebsite($stateParams.link).then(function(website){
  //     $scope.website = website;
  //   });
  // };

  // $scope.getWebsite();
});
