app.controller('WebsiteEditorContainerCtrl', function($scope, $stateParams, WebsitesService, NodesService){

  WebsitesService.getWebsite($stateParams.link).then(function(website){
    $scope.website = website;
    NodesService.getNodes($stateParams.link).then(function(nodes){
      $scope.nodes = nodes;
    });
  })

})
