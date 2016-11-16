app.controller('WebsitesListController', function($scope, websites, ngDialog, WebsitesService, Loader){
  $scope.websites = websites;

  $scope.newWebsite = function(){
    $scope.website = {};
    $scope.websiteDialog = ngDialog.open({
      template:
        '<form class="ui-kit" name="form" ng-submit="submitForm(form)" novalidate="">' +
          '<h3>Create new website</h3>' +
          '<div class="message danger" ng-show="form.$submitted && ( form.$invalid || errorMessage )">' +
            '<span ng-messages="form.name.$error">' +
              '<span ng-message="required">Enter website name</span>' +
            '</span>' +
            '<span ng-messages="form.permalink.$error">' +
              '<span ng-message="required">Enter website link</span>' +
              '<span ng-message="pattern">Permalink should have only small characters, letters, \'-\'  or \'_\'</span>'+
            '</span>' +
            '<span ng-if="errorMessage">{{errorMessage}}</span>' +
          '</div>' +
          '<label>' +
            'Website name' +
            '<input ng-class="{error: form.$submitted && form.name.$invalid}" name="name" type="text" ng-model="website.name" required=""/>' +
          '</label>' +
          '<label class="suffix">' +
            'Website link' +
            '<input ng-class="{error: form.$submitted && form.permalink.$invalid}" name="permalink" type="text" ng-model="website.permalink" required="" pattern="^([A-Za-z0-9\-_]+)$"/>' +
            '<div class="suffix">.33inch.com</div>' +
          '</label>' +
          '<div class="actions">' +
            '<span class="button small" ng-click="closeThisDialog()">Cancel</span>' +
            '<input class="button small success" type="submit" value="Create website" ng-disabled="isLoading || form.$pristine">' +
          '</div>' +
        '</form>',
      plain: true,
      scope: $scope
    });
  };

  $scope.submitForm = function(form) {
    if ( !$scope.form ) {
      $scope.form = form;
    }
    if ( $scope.isLoading ) {
      return;
    }
    $scope.errorMessage = false;
    if ( $scope.form.$valid ) {
      $scope.isLoading = true;
      Loader.show('Creating new website...');
      WebsitesService.create($scope.website).then(function(website){
        $scope.isLoading = false;
        $scope.websiteDialog.close();
        window.location = '/app/' + $scope.website.permalink;
      }, function(error){
        $scope.errorMessage = error.message;
        $scope.isLoading = false;
        Loader.hide();
      });
    }
  };

});
