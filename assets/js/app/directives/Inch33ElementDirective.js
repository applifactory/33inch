app.directive('inch33Element', function($compile, $http, Inch33ElementService){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ngModel: '='
    },
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          $http.get('assets/app/website/components/' + scope.ngModel.template + '.html').success(function(html){
            scope.config = Inch33ElementService.getConfig(scope.ngModel.template);

            var el = angular.element(html);

            console.log(el);
            angular.forEach(scope.config.texts, function(text){
              console.log( el.find(text.selector) );
            });

            var compiled = $compile(el);
            iElement.append(el);
            compiled(scope);

            console.log('doneqwdqwd');
          });
        },
        post: function(scope, iElement, iAttrs, controller) {

        }
      }
    }
  }
})

//  http://daginge.com/technology/2014/03/04/understanding-template-compiling-in-angularjs/
