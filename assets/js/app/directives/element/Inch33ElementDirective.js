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
            if ( !scope.ngModel.data.hasOwnProperty('style') || !scope.ngModel.data.style )
              scope.ngModel.data.style = scope.config.style ? scope.config.style : {};
            if ( scope.ngModel.data.style.hasOwnProperty('backgroundColor') )
              Inch33ElementService.registerColor(scope.ngModel.data.style.backgroundColor);
            el[0].setAttribute('ng-style', 'ngModel.data.style');

            //  elements
            var agregateColumns = ( scope.config.columns && !scope.ngModel.data.hasOwnProperty('columns') );
            if ( scope.config.elements ) {
              scope.config.elements.forEach(function(element){
                element.id = element.selector.replace(/[^a-z0-9]+/gi, ' ').trim().replace(/ /gi, '-');

                //  init data elements
                if ( !scope.ngModel.data.hasOwnProperty(element.id) )
                  scope.ngModel.data[element.id] = {};

                //  find element
                var _el = el[0].querySelector(element.selector);

                //  base params
                _el.setAttribute('element-id', scope.ngModel._id);
                _el.setAttribute('link', scope.$parent.$parent.link);

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

                //  background or image
                if ( element.type && ( element.type == 'background' || element.type == 'image' ) ) {
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
                  if ( element.type == 'background' ) {
                    _el.setAttribute('ng-style', 'column["' + element.id + '"].style');
                    _el.setAttribute('ng-model', 'column["' + element.id + '"].style');
                    _el.setAttribute('background-edit', '');
                  }
                  if ( element.type == 'image' ) {
                    _el.setAttribute('ng-style', 'ngModel.data["' + element.id + '"].style');
                    _el.setAttribute('ng-src', '{{column["' + element.id + '"].image}}');
                    _el.setAttribute('ng-model', 'column["' + element.id + '"].image');
                    _el.setAttribute('image-edit', '');
                  }
                }

                //  attachement
                if ( element.type && element.type == 'attachement' ) {
                  if ( element.column )
                    _el.setAttribute('attachement-edit', 'column[\'' + element.id + '\'].attachement');
                  else
                    _el.setAttribute('ng-model', 'ngModel.data["' + element.id + '"].attachement');
                }

              });
            } else {
              // no elements, undefined
              if ( ['blikeo-social-buttons', 'efectivo-social-buttons'].indexOf( scope.ngModel.template ) >= 0 ) {
                iElement.css('position', 'static');
              }
            }

            //  columns
            if ( scope.config.columns ) {
              //  column count
              if ( !scope.ngModel.data.hasOwnProperty('columnCount') )
                scope.ngModel.data.columnCount = scope.config.columns.default;
              var _el = el[0].querySelector('.columns, .slides');
              _el.setAttribute('ng-model', 'ngModel.data.columns');
              if ( scope.config.columns.min != scope.config.columns.max )
                _el.setAttribute('class', 'col-{{ngModel.data.columnCount}}');
              //  column repeater
              var _col = _el.querySelector('*');
              _col.setAttribute('ng-repeat', 'column in ngModel.data.columns');
              while ( _el.children.length > 1 )
                _el.children[1].remove();
              _el.querySelector('*').setAttribute('column-item-tools', '');
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
              var _data = data ? JSON.parse(angular.toJson(data)) : {};
              var _oldData = oldData ? JSON.parse(angular.toJson(oldData)) : {};
              var _changes = Diff.getChanges(_oldData, _data);
              if ( Object.keys(_changes).length )
                ElementsService.update(scope.$parent.$parent.link, scope.ngModel._id, {data: _changes});
            }
          }, true);
        }
      }
    }
  }
})

//  http://daginge.com/technology/2014/03/04/understanding-template-compiling-in-angularjs/
