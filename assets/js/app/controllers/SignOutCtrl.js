app.controller('SignOutCtrl', function($scope, AuthService, $state){

  AuthService.signOut().then(function(){
    $state.go('account');
  });

})
