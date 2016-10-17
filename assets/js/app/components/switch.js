app.directive('switch', {
  template: '<handle></ handle>',
  bindings: {
    state: '=ngModel',
    callback: '&onChange',
    disabled: '=disabled'
  },
  controller: function(scope, el, attrs){
    function updateView() {
      if ( scope.state )
        el[0].classList.add('on');
      else
        el[0].classList.remove('on');
      if ( scope.disabled === undefined || !scope.disabled )
        el[0].classList.remove('disabled');
      else
        el[0].classList.add('disabled');
    }
    el.bind('click', function(){
      if (scope.disabled === undefined || !scope.disabled) {
        scope.state = !scope.state;
        updateView();
        scope.$apply();
        scope.callback({state: scope.state});
      }
    });
    scope.$watch('state', function(){
      updateView();
    });
    scope.$watch('disabled', function(){
      updateView();
    });
  }
});
