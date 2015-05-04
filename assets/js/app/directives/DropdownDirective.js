app.directive('dropdown', function($http, $compile, $timeout){
  return {
    restrict: 'A',
    scope: false,
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          if ( !iAttrs.dropdown ) {
            console.error('Missing `dropdown` value');
            return;
          }
          var name = iAttrs.dropdown.replace(/^[\S]+\/([\S]+)\.[\S]+$/gi, '$1').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
          var toggle = function() {
            iElement.toggleClass('open');
            if ( iElement.hasClass('open') ) {
              stack = ['main'];
              updateStack();
              scope.$broadcast('dropdown:open', name, stack[stack.length-1]);
            } else {
              scope.$broadcast('dropdown:close', name, stack[stack.length-1]);
              $timeout(function(){
                stack = ['main'];
                updateStack();
              }, 350);
            }
          }
          iElement.bind('click', function(event){
            var e = event.target;
            var rel = iElement[0].querySelector('.dropdown');
            while ( e && e.parentElement && e.parentElement != window ) {
              if ( e == rel )
                return;
              e = e.parentElement;
            }
            toggle();
          });

          angular.element(document).bind('click', function(event){
            if ( iElement.hasClass('open') ) {
              var e = event.target;
              while ( e && e.parentElement && e.parentElement != window ) {
                if ( e == iElement[0] )
                  return;
                e = e.parentElement;
              }
              scope[name].close();
            }
          });

          var views = [];
          var stack = [];

          var updateStack = function() {
            angular.forEach(views, function(view) {
              if ( stack.indexOf(view.name) == stack.length - 1 ) {
                //  current
                view.el.classList.add('active');
                view.el.classList.remove('hidden');
              } else if ( stack.indexOf(view.name) < 0 ) {
                //  next
                view.el.classList.remove('active');
                view.el.classList.remove('hidden');
              } else {
                //  previous
                view.el.classList.remove('active');
                view.el.classList.add('hidden');
              }
            });
            $timeout(function(){
              iElement[0].querySelector('.viewport').style.height = ( iElement[0].querySelector('.view.active').offsetHeight + 10 ) + 'px';
            });
          }

          $http.get(iAttrs.dropdown).success(function(template){
            var el = angular.element('<div class="dropdown"><div class="viewport">' + template + '</div></div>');
            var compiled = $compile(el);
            iElement.append(el);
            compiled(scope);
            angular.forEach(iElement[0].querySelectorAll('.view'), function(item){
              views.push({
                name: item.getAttribute('name'),
                el: item
              });
            });
            angular.forEach(iElement[0].querySelectorAll('[view]'), function(item){
              angular.element(item).bind('click', function(){
                stack.push(item.getAttribute('view'));
                scope.$broadcast('dropdown:push', name, stack[stack.length-1]);
                updateStack();
              });
            });
            angular.forEach(iElement[0].querySelectorAll('.back'), function(item){
              angular.element(item).html('<i class="fa fa-angle-left"></i> back').bind('click', function(){
                scope.$broadcast('dropdown:pop', name, stack.pop());
                updateStack();
              });
            });
            stack = ['main'];
            updateStack();
          });

          scope[name] = {
            open: function() {
              if ( !iElement.hasClass('open') ) {
                stack = ['main'];
                updateStack();
                iElement.addClass('open');
                scope.$broadcast('dropdown:open', name, stack[stack.length-1]);
              }
            },
            close: function() {
              if ( iElement.hasClass('open') ) {
                iElement.removeClass('open');
                scope.$broadcast('dropdown:close', name, stack[stack.length-1]);
                $timeout(function() {
                  stack = ['main'];
                  updateStack();
                }, 350);
              }
            },
            back: function(){
              if ( stack.length > 1 ) {
                scope.$broadcast('dropdown:pop', name, stack.pop());
                updateStack();
              }
            }
          }
        }
      }
    }
  }
})
