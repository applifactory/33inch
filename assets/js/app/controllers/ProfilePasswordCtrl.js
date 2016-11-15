app.controller('ProfilePasswordController', function($scope, $rootScope, UserService, $timeout, Loader){

  $scope.reset = function() {
    $scope.user = {};
    if ( $scope.form ) {
      $scope.form.$setPristine();
    }
  };

  var updatedTimeout = null;
  $scope.submitForm = function() {
    if ( $scope.isLoading ) {
      return;
    }
    $scope.errorConfirm = $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      if ( $scope.user.newPassword != $scope.user.newPasswordConfirm ) {
        $scope.errorConfirm = true;
        return;
      }
      $scope.isLoading = true;
      $scope.updated = false;

      Loader.show('Changing password...');
      UserService.changePassword($rootScope.currentUser._id, $scope.user.currentPassword, $scope.user.newPassword).then(function(){
        $scope.isLoading = false;
        $scope.reset();
        Loader.hide();
        $scope.updated = true;
        $timeout.cancel(updatedTimeout);
        updatedTimeout = $timeout(function(){
          $scope.updated = false;
        }, 2000);
      }, function(error){
        $scope.errorMessage = error.message;
        $scope.isLoading = false;
        Loader.hide();
      });
    }
  };

});
