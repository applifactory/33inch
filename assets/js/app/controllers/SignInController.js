app.controller('SignInCtrl', function($scope, AuthService, $state){

  $scope.credentials = {
    email: sessionStorage.signInFormEmail || '',
    password: '',
    stayLogged: false
  };

  $scope.errorMessage = null;
  $scope.isLoading = true;

  //  check if logged in
  AuthService.me().then(function(){
    $state.go('app');
  }, function(){
    $scope.isLoading = false;
  });

  //  clear login error on typing
  var watchCredentials = $scope.$watch('credentials', function(credentials){
    $scope.errorMessage = null;
  }, true);

  $scope.$on('$destroy', function() {
    watchCredentials();
    sessionStorage.signInFormEmail = $scope.credentials.email || '';
  });

  //  do login
  $scope.submitForm = function() {
    if ( !$scope.isLoading && $scope.signInForm.$valid ) {
      $scope.isLoading = true;
      $scope.errorMessage = null;
      AuthService.signIn($scope.credentials.email, $scope.credentials.password, $scope.credentials.stayLogged).then(function(){
        $scope.errorMessage = false;
        $state.go('app');
      }, function(error){
        $scope.isLoading = false;
        $scope.errorMessage = error;
      });
    }
  }

})
