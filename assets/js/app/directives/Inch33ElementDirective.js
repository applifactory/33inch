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

            if ( scope.config.elements ) {
              scope.config.elements.forEach(function(element){
                element.id = element.selector.replace(/[^a-z0-9]+/gi, ' ').trim().replace(/ /gi, '-');

                //  init data object
                if ( !scope.ngModel.hasOwnProperty('data') )
                  scope.ngModel.data = {};

                //  init data elements
                if ( !scope.ngModel.data.hasOwnProperty(element.id) )
                  scope.ngModel.data[element.id] = {};

                //  set default element values, bind view
                if ( element.hasOwnProperty('elements') && !scope.ngModel.data[element.id].hasOwnProperty('elements') ) {
                  scope.ngModel.data[element.id].elements = element.elements;

                  var _el = el[0].querySelector(element.selector);
                  _el.setAttribute('ng-if', 'ngModel.data["' + element.id + '"].elements');
                  console.log(element.id + '.elements');

                }

              });
            }

            var dropdown = angular.element('<tools-dropdown ng-model="ngModel.data" config="config"></tools-dropdown>');
            el.prepend(dropdown);

            //console.log(scope.ngModel.template);
            //console.log(scope.config);

            var compiled = $compile(el);
            iElement.append(el);
            compiled(scope);

          });
        },
        post: function(scope, iElement, iAttrs, controller) {

        }
      }
    }
  }
})

//  http://daginge.com/technology/2014/03/04/understanding-template-compiling-in-angularjs/
