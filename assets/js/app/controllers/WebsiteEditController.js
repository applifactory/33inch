app.controller('WebsiteEditCtrl', function($scope, $stateParams, NodesService){

  var unwatchNodes = $scope.$watchCollection('nodes', function(nodes){
    if ( nodes ) {
      NodesService.findPath($stateParams.path, nodes);
      unwatchNodes();
    }
  })

//  console.log($stateParams);
//  WebsitesService.getWebsite($stateParams.link).then(function(website){
//    console.log(website);
//  })



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
