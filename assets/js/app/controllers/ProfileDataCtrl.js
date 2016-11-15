app.controller('ProfileDataController', function($scope, $rootScope, UserService, $timeout, Loader){

  $scope.reset = function() {
    $scope.user = angular.copy($rootScope.currentUser);
    if ( $scope.form ) {
      $scope.form.$setPristine();
    }
  };

  $scope.reset();
  UserService.get($rootScope.currentUser._id).then(function(result){
    $scope.user = result.user;
  });

  var updatedTimeout = null;
  $scope.submitForm = function() {
    if ( $scope.isLoading ) {
      return;
    }
    $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      $scope.isLoading = true;
      $scope.updated = false;
      var update = {
        name: $scope.user.name,
        surname: $scope.user.surname
      };
      Loader.show('Saving...');
      UserService.update($rootScope.currentUser._id, update).then(function(){
        $scope.isLoading = false;
        $rootScope.currentUser.name = update.name;
        $rootScope.currentUser.surname = update.surname;
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
