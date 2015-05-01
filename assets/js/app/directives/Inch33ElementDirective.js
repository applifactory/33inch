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

            //  init data object
            if ( !scope.ngModel.hasOwnProperty('data') )
              scope.ngModel.data = {};

            //  columns
            if ( scope.config.columns ) {
              if ( !scope.ngModel.data.hasOwnProperty('columns') )
                scope.ngModel.data.columns = scope.config.columns.default;
              var _el = el[0].querySelector('.columns');
              _el.setAttribute('class', 'col-{{ngModel.data.columns}}');
            }

            //  styles
            if ( scope.config.style && !scope.ngModel.data.hasOwnProperty('style') ) {
              scope.ngModel.data.style = scope.config.style;
            }
            el[0].setAttribute('ng-style', 'ngModel.data.style');

            //  elements
            if ( scope.config.elements ) {
              scope.config.elements.forEach(function(element){
                element.id = element.selector.replace(/[^a-z0-9]+/gi, ' ').trim().replace(/ /gi, '-');

                //  init data elements
                if ( !scope.ngModel.data.hasOwnProperty(element.id) )
                  scope.ngModel.data[element.id] = {};

                //  set default element values, bind view
                if ( element.hasOwnProperty('elements') ) {
                  if ( !scope.ngModel.data[element.id].hasOwnProperty('elements') )
                    scope.ngModel.data[element.id].elements = element.elements;
                  var _el = el[0].querySelector(element.selector);
                  _el.setAttribute('ng-if', 'ngModel.data["' + element.id + '"].elements');
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
