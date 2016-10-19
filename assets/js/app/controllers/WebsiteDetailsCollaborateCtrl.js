app.controller('WebsiteDetailsCollaborateController', function($scope, $stateParams, WebsitesService, Loader, $timeout) {

  var updatedTimeout = null;
  var loadShares = function() {
    $scope.isLoading = true;
    WebsitesService.getShares($stateParams.link).then(function(shares){
      $scope.shares = shares;
      $scope.isLoading = false;
      Loader.hide();
    });
  };
  loadShares();

  $scope.submitForm = function() {
    if ( $scope.isLoading ) {
      return;
    }
    $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      $scope.isLoading = true;
      $scope.updated = false;
      Loader.show('Sharing website...');
      WebsitesService.share($stateParams.link, $scope.inviteEmail).then(function(){
        $scope.isLoading = false;
        $scope.inviteEmail = '';
        Loader.hide();
        $scope.showUpdated('Invitation sent');
        loadShares();
        $scope.form.$submitted = false;
      }, function(error){
        $scope.errorMessage = 'Unexpected error';
        $scope.isLoading = false;
        Loader.hide();
      });
    }
  };

  $scope.showUpdated = function(message) {
    $scope.updated = message;
    $timeout.cancel(updatedTimeout);
    updatedTimeout = $timeout(function(){
      $scope.updated = false;
    }, 2000);
  };

  $scope.deleteShare = function(share) {
    Loader.show('Removing connection...');
    WebsitesService.deleteShare($stateParams.link, share).then(function(){
      loadShares();
      $scope.showUpdated('Connection removed');
    });
  };

});
