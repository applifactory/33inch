app.directive('inch33Element', function($compile, $templateRequest, Inch33ElementService, Diff, ElementsService, $window, NodesService){
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ngModel: '=',
      collection: '='
    },
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          $templateRequest('assets/app/website/components/' + scope.ngModel.template + '.html').then(function(html){
            scope.config = Inch33ElementService.getConfig(scope.ngModel.template);

            var el = angular.element(html);

            //  init data object
            if ( !scope.ngModel.hasOwnProperty('data') )
              scope.ngModel.data = {};

            //  styles
            if ( !scope.ngModel.data.hasOwnProperty('style') )
              scope.ngModel.data.style = scope.config.style ? scope.config.style : {};
            el[0].setAttribute('ng-style', 'ngModel.data.style');

            //  elements
            //delete scope.ngModel.data.columns;
            var agregateColumns = ( scope.config.columns && !scope.ngModel.data.hasOwnProperty('columns') );
            if ( scope.config.elements ) {
              scope.config.elements.forEach(function(element){
                element.id = element.selector.replace(/[^a-z0-9]+/gi, ' ').trim().replace(/ /gi, '-');

                //  init data elements
                if ( !scope.ngModel.data.hasOwnProperty(element.id) )
                  scope.ngModel.data[element.id] = {};

                //  find element
                var _el = el[0].querySelector(element.selector);

                //  set default element values, bind view
                if ( element.hasOwnProperty('elements') ) {
                  if ( !scope.ngModel.data[element.id].hasOwnProperty('elements') )
                    scope.ngModel.data[element.id].elements = element.elements;
                  _el.setAttribute('ng-if', 'ngModel.data["' + element.id + '"].elements');
                }

                //  texts
                if ( element.type && element.type == 'text' ) {

                  if ( element.column ) {
                    //  column repeater texts
                    if ( !scope.ngModel.data.hasOwnProperty('columns') )
                      scope.ngModel.data.columns = [];

                    if ( agregateColumns ) {
                      var _els = el[0].querySelectorAll(element.selector);
                      angular.forEach(_els, function(__el, i){
                        if ( scope.ngModel.data.columns.length <= i )
                          scope.ngModel.data.columns.push({});
                        if ( !scope.ngModel.data.columns[i].hasOwnProperty(element.id) )
                          scope.ngModel.data.columns[i][element.id] = {};
                        if ( !scope.ngModel.data.columns[i][element.id].hasOwnProperty('text') )
                        scope.ngModel.data.columns[i][element.id].text = __el.innerHTML;
                      });
                    }

                    _el.setAttribute('ng-model', 'column["' + element.id + '"].text');

                  } else {
                    //  regular text
                    if ( !scope.ngModel.data[element.id].hasOwnProperty('text') )
                      scope.ngModel.data[element.id].text = _el.innerHTML;
                    _el.setAttribute('ng-model', 'ngModel.data["' + element.id + '"].text');
                  }

                  _el.setAttribute('ng-style', 'ngModel.data["' + element.id + '"].style');
                  _el.setAttribute('ng-model-options', '{ updateOn: \'default blur\', debounce: {\'default\': 1000, \'blur\': 0} }');
                  _el.setAttribute('contenteditable', '');

                  var editor = document.createElement('editor');
                  editor.setAttribute('ng-model', 'ngModel.data["' + element.id + '"]');
                  if ( element.hasOwnProperty('elements') ) {
                    editor.setAttribute('ng-if', 'ngModel.data["' + element.id + '"].elements');
                  }
                  _el.parentElement.insertBefore(editor, _el);
                  editor.appendChild(_el);
                }

                //  background
                if ( element.type && element.type == 'background' ) {
                  //  create tool
                  if ( !scope.ngModel.data.hasOwnProperty('columns') )
                    scope.ngModel.data.columns = [];
                  if ( agregateColumns ) {
                    var _els = el[0].querySelectorAll(element.selector);
                    angular.forEach(_els, function(__el, i){
                      if ( scope.ngModel.data.columns.length <= i )
                        scope.ngModel.data.columns.push({});
                      if ( !scope.ngModel.data.columns[i].hasOwnProperty(element.id) )
                        scope.ngModel.data.columns[i][element.id] = {};
                      if ( !scope.ngModel.data.columns[i][element.id].hasOwnProperty('style') )
                        scope.ngModel.data.columns[i][element.id].style = {};
                    });
                  }
                  _el.setAttribute('ng-model', 'column["' + element.id + '"].style');
                  _el.setAttribute('element-id', scope.ngModel._id);
                  _el.setAttribute('link', scope.$parent.$parent.link);
                  _el.setAttribute('ng-style', 'column["' + element.id + '"].style');
                  _el.setAttribute('background-edit', '');
                }

              });
            }

            //  columns
            if ( scope.config.columns ) {
              //  column count
              if ( !scope.ngModel.data.hasOwnProperty('columnCount') )
                scope.ngModel.data.columnCount = scope.config.columns.default;
              var _el = el[0].querySelector('.columns');
              _el.setAttribute('class', 'col-{{ngModel.data.columnCount}}');
              //  column repeater
              var _col = _el.querySelector('*');
              _col.setAttribute('ng-repeat', 'column in ngModel.data.columns');
              while ( _el.children.length > 1 )
                _el.children[1].remove();
            }

            if ( scope.ngModel.template.indexOf('menu') < 0 ) {
              var dropdown = angular.element('<tools-dropdown ng-model="ngModel" config="config" collection="collection"></tools-dropdown>');
              el.prepend(dropdown);
            } else {
              var dropdown = angular.element('<menu-dropdown ng-model="ngModel" config="config" collection="collection"></menu-dropdown>');
              var _menu = el[0].querySelector('ul');
              _menu.setAttribute('menu-nav', '');
              _menu.setAttribute('ng-model', 'ngModel');
              var _logo = el[0].querySelector('.logo');
              _logo.innerHTML = '<img ng-src="{{ngModel.data.logoImage}}" alr="Logo"/>';
              el.prepend(dropdown);
              scope.nodes = NodesService.currentNodes;
            }

            var compiled = $compile(el);
            iElement.append(el);
            compiled(scope);

          });
        },
        post: function(scope, iElement, iAttrs, controller) {
          scope.$watch('ngModel.data', function(data, oldData){
            if ( data ) {
              _data = data ? JSON.parse(angular.toJson(data)) : {};
              _oldData = oldData ? JSON.parse(angular.toJson(oldData)) : {};
              ElementsService.updateData(scope.$parent.$parent.link, scope.ngModel._id, Diff.getChanges(_oldData, _data));
              console.log(Diff.getChanges(_oldData, _data));
            }
          }, true);
        }
      }
    }
  }
})

//  http://daginge.com/technology/2014/03/04/understanding-template-compiling-in-angularjs/
