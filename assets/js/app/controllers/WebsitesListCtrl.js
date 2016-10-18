app.controller('WebsitesListController', function($scope, websites){

  console.log(websites);
  $scope.websites = websites;

  console.log('WebsitesListController');
  // $scope.$on('$viewContentLoaded', function(event){
  //   if ( $state.current.name == 'app' ) {
  //     $scope.isLoading = true;
  //     WebsitesService.getAll().then(function(websites){
  //       $scope.websites = websites;
  //       $scope.isLoading = false;
  //     });
  //   }
  // });

});
