app.controller('SignUpCtrl', function($scope, AuthService, $state){

  $scope.credentials = {
    email: sessionStorage.signInFormEmail || '',
    password: ''
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

  //  do register
  $scope.submitForm = function() {
    if ( !$scope.isLoading && $scope.signUpForm.$valid ) {
      $scope.isLoading = true;
      $scope.errorMessage = null;
      AuthService.signUp($scope.credentials.email, $scope.credentials.password).then(function(){
        $scope.errorMessage = false;
        $state.go('app');
      }, function(error){
        $scope.isLoading = false;
        $scope.errorMessage = error;
      });
    }
  }

})
