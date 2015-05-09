app.controller('WebsiteEditCtrl', function($scope, $stateParams, NodesService){

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
        console.log('#TODO: redirect to parent');
      });
    }
  });

//
//  $scope.elements = [
//    {
//      template: 'header-straight',
//      data: {
//      }
//    }, {
//      template: 'article-text',
//      data: {
//      }
//    }, {
//      template: 'article-features',
//      data: {
//        columns: [
//          {
//            'container-li-h3': {
//              text: 'qdwdqwdqwd'
//            },
//            'container-li-p': {
//              text: 'qdwdqwdqwd qw dq wdqw'
//            }
//          }
//        ]
//      }
//    }, {
//      template: 'showcase-grid',
//      data: {}
//    }, {
//      template: 'list-grid',
//      data: {}
//    }
//  ];

});
