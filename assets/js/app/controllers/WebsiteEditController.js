app.controller('WebsiteEditCtrl', function($scope, $stateParams, NodesService){

  $scope.link = $stateParams.link;
  $scope.path = null;
  $scope.currentNode = null;
  $scope.topElements = null;
  $scope.elements = null;
  $scope.bottomElements = null;

  var unwatchNodes = $scope.$watchCollection('nodes', function(nodes){
    if ( nodes ) {
      unwatchNodes();
      NodesService.findPath($stateParams.path, nodes).then(function(path){
        $scope.path = path;
        $scope.currentNode = path[path.length-1];
        NodesService.getNode($stateParams.link, $scope.currentNode._id).then(function(node){
          $scope.topElements = [];
          $scope.bottomElements = [];
          angular.forEach(node.baseElements, function(_element){
            if ( _element.template.indexOf('menu') >= 0 )
              $scope.topElements.push(_element);
            else
              $scope.bottomElements.push(_element);
          });
          $scope.elements = node.elements;
        });
      }, function(){
        console.error('#TODO: redirect to parent');
      });
    }
  });

});
