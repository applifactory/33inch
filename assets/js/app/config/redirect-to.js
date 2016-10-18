app.run(function($rootScope, $state){
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
    if (toState.redirectTo) {
      event.preventDefault();
      $state.go(toState.redirectTo, toParams);
    }
  });
})
