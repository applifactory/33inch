app.controller('SignInCtrl', function($scope, AuthService){

  $scope.credentials = {
    email: '',
    password: ''
  };

  $scope.errorMessage = null;

  var watchCredentials = $scope.$watch('credentials', function(credentials){
    $scope.errorMessage = null;
  }, true);

  $scope.$on('$destroy', function() {
    watchCredentials();
  });

  $scope.submitForm = function() {
    if ( !$scope.isLoading && $scope.signInForm.$valid ) {
      $scope.isLoading = true;
      $scope.errorMessage = null;
      AuthService.signIn($scope.credentials.email, $scope.credentials.password).then(function(){
        $scope.isLoading = false;
        $scope.errorMessage = false;
      }, function(error){
        $scope.isLoading = false;
        $scope.errorMessage = error;
      });
    }
  }

})
