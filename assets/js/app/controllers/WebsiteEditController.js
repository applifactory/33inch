app.controller('WebsiteEditCtrl', function($scope, $stateParams, WebsitesService){

  WebsitesService.getWebsite($stateParams.link).then(function(website){
    console.log(website);
  })



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
