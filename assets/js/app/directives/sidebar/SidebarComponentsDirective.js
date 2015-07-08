app.directive('sidebarComponents', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'assets/app/website/sidebar/components.html',
    controller: function($scope, $rootScope) {
      $scope.components = [
        {
          id: 'menu-default',
          name: 'Default menu'
        }, {
          id: 'article-features',
          name: 'List with images'
        }, {
          id: 'article-text',
          name: 'Text article'
        }, {
          id: 'attachements-list',
          name: 'Attachements list'
        }, {
          id: 'header-section',
          name: 'Section header'
        }, {
          id: 'header-slider',
          name: 'Teaser left'
        }, {
          id: 'header-straight',
          name: 'Teaser'
        }, {
          id: 'list-grid',
          name: 'Paragraphs in columns'
        }, {
          id: 'showcase-grid',
          name: 'Showcase images grid'
        }, {
          id: 'subscribe-form',
          name: 'Subscribe form'
        }, {
          id: 'footer-default',
          name: 'Default footer'
        }
      ];

      $scope.addComponent = function(id) {
        $rootScope.$emit('Sidebar:Components:Add', id);
      }

    }
  }
})
