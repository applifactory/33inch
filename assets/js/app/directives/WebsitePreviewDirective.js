app.directive('websitePreview', function($http){
  return {
    restrict: 'A',
    scope: {
      website: '=websitePreview'
    },
    link: function(scope, el, attr) {
      scope.$watch('website', function(website) {
        if ( website.lastExport ) {
          var timestamp = (new Date(website.lastExport)).getTime();
          $http.get('/preview/' + website.permalink).then(function(response){
            el.html(response.data);
          });
        } else {
          el.html('');
        }
      });
    }
  };
});
