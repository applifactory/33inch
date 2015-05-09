app.controller('WebsiteEditCtrl', function($scope, $stateParams, NodesService){

  $scope.link = $stateParams.link;
  $scope.path = null;
  $scope.currentNode = null;
  $scope.elements = null;

  var unwatchNodes = $scope.$watchCollection('nodes', function(nodes){
    if ( nodes ) {
      unwatchNodes();
      NodesService.findPath($stateParams.path, nodes).then(function(path){
        $scope.path = path;
        $scope.currentNode = path[path.length-1];
        NodesService.getNode($stateParams.link, $scope.currentNode._id).then(function(node){
          console.log('elements: ', node);
          $scope.elements = node.elements;
        });
      }, function(){
        console.error('#TODO: redirect to parent');
      });
    }
  });

});
