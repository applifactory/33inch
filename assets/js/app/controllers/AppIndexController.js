app.controller('AppIndexCtrl', function($scope, WebsitesService){

  $scope.websites = [];
  $scope.isLoading = true;

  WebsitesService.getAll().then(function(websites){
    $scope.websites = websites;
    $scope.isLoading = false;
  });

  $scope.getWebsiteLink = function(website) {
    return website.domain ? website.domain : website.permalink + '.33inch.com';
  }

})