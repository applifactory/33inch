app.controller('WebsiteEditorContainerCtrl', function($scope, $stateParams, WebsitesService, NodesService, $window){

  WebsitesService.get($stateParams.link).then(function(website){
    $scope.website = website;
    NodesService.getNodes($stateParams.link).then(function(nodes){
      $scope.nodes = nodes;
    });
  });

  $window.exportWebsite = function(domain) {
    console.log('Exporting website...');
    WebsitesService.export($stateParams.link, domain).then(function(){
      console.log('export complete');
    }, function(err){
      console.log('export error', err);
    });
  };

});
