app.controller('AppIndexCtrl', function($scope, WebsitesService, $location){

  $scope.websites = [];
  $scope.isLoading = true;

  WebsitesService.getAll().then(function(websites){
    $scope.websites = websites;
    $scope.isLoading = false;
    if ( websites.length )
      $location.path('/app/' + websites[0].permalink);
  });

  $scope.getWebsiteLink = function(website) {
    return website.domain ? website.domain : website.permalink + '.33inch.com';
  }

})
