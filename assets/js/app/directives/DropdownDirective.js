app.directive('dropdown', function($http, $compile){
  return {
    restrict: 'A',
    compile: function(tElement, tAttrs, transclude) {
      return {
        pre: function(scope, iElement, iAttrs, controller) {
          if ( !iAttrs.dropdown ) {
            console.error('Missing `dropdown` value');
            return;
          }
          var name = iAttrs.dropdown.replace(/^[\S]+\/([\S]+)\.[\S]+$/gi, '$1');
          var toggle = function() {
            stack = ['main'];
            updateStack();
            iElement.toggleClass('open');
            if ( iElement.hasClass('open') )
              scope.$broadcast('dropdown:open', name);
            else
              scope.$broadcast('dropdown:close', name);
          }
          iElement.bind('click', function(event){
            var rel = iElement[0].querySelector('.dropdown');
            var e = event.toElement || event.relatedTarget;
            while( e && e.parentNode && e.parentNode != window ) {
              if ( e.parentNode == rel ||  e == rel ) {
                return false;
              }
              e = e.parentNode;
            }
            toggle();
          });

          angular.element(document).bind('click', function(event){
            if ( iElement.hasClass('open') ) {
              var rel = iElement[0].querySelector('.dropdown').parentNode;
              var e = event.toElement || event.relatedTarget;
              while( e && e.parentNode && e.parentNode != window ) {
                if ( e.parentNode == rel ||  e == rel ) {
                  return false;
                }
                e = e.parentNode;
              }
              toggle();
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
            iElement[0].querySelector('.viewport').style.height = ( iElement[0].querySelector('.view.active').offsetHeight + 10 ) + 'px';
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
                updateStack();
              });
            });
            angular.forEach(iElement[0].querySelectorAll('.back'), function(item){
              angular.element(item).html('<i class="fa fa-angle-left"></i> back').bind('click', function(){
                stack.pop();
                updateStack();
              });
            });
            stack = ['main'];
            updateStack();
          });
        }
      }
    }
  }
})
