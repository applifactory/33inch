app.controller('WebsiteEditCtrl', function($scope, $stateParams, NodesService, ElementsService, $rootScope){

  $scope.link = $stateParams.link;
  $scope.path = null;
  $scope.currentNode = null;
  $scope.topElements = null;
  $scope.elements = null;
  $scope.bottomElements = null;

  var getElementPosition = function(id) {
    var position = 0;
    angular.forEach($scope.elements, function(element, i){
      if ( element._id == id )
        position = i;
    });
    return position;
  }

  var unwatchAdd = $rootScope.$on('Sidebar:Components:Add', function(event, id){
    var position = -1;
    angular.forEach(document.querySelectorAll('inch33-element'), function(item){
      if ( position < 0 && item.offsetTop > window.scrollY ) {
        position = getElementPosition( angular.element(item).scope().element._id );
      }
    });
    if ( !position && window.scrollY > window.innerHeight / 2 )
      position = $scope.elements.length;

    if ( id.indexOf('menu') >= 0 || id.indexOf('footer') >= 0 ) {
      ElementsService.createBaseElement(id, $stateParams.link).then(function(node){
        if ( id.indexOf('menu') >= 0 ) {
          $scope.topElements.push(node);
          ElementsService.updatePositions($stateParams.link, $scope.topElements);
        }
        if ( id.indexOf('footer') >= 0 ) {
          $scope.bottomElements.push(node);
          ElementsService.updatePositions($stateParams.link, $scope.bottomElements);
        }
      });
    } else {
      ElementsService.createElement(id, $stateParams.link, $scope.currentNode._id).then(function(node){
        $scope.elements.splice(position, 0, node);
        ElementsService.updatePositions($stateParams.link, $scope.elements);
      });
    }
  })

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

  $scope.$on('$destroy', function() {
    unwatchAdd();
    unwatchNodes();
  });

});
