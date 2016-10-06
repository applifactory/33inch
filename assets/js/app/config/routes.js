app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/app");

  var userResolver = function(AuthService, $state) {
    return AuthService.me().then(function(me){
      return me.user;
    }, function(){
      $state.go('sign-in');
    });
  }

  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'assets/app/index.html',
      controller: 'AppIndexCtrl',
      resolve: {
        user: userResolver
      }
    })
    //
      .state('app.details', {
        url: '/details',
        template: 'details'
      })

    .state('edit', {
      url: '/app/:link',
      abstract: true,
      templateUrl: 'assets/app/website/editor-container.html',
      controller: 'WebsiteEditorContainerCtrl',
      resolve: {
        user: userResolver
      }
    })
      .state('edit.node', {
        url: '*path',
        templateUrl: 'assets/app/website/edit.html',
        controller: 'WebsiteEditCtrl'
      })

    //  Account
    .state('sign-in', {
      url: '/sign-in',
      templateUrl: 'assets/app/account/sign-in.html',
      controller: 'SignInCtrl'
    })
    .state('sign-up', {
      url: '/sign-up',
      templateUrl: 'assets/app/account/sign-up.html',
      controller: 'SignUpCtrl'
    })
    .state('logout', {
      url: '/logout',
      template: '',
      controller: 'SignOutCtrl'
    });



});
