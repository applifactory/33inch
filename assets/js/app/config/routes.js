app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/app");

  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'assets/app/index.html',
      controller: 'AppIndexCtrl'
    })

    .state('edit', {
      url: '/app/:link',
      abstract: true,
      templateUrl: 'assets/app/website/editor-container.html',
      controller: 'WebsiteEditorContainerCtrl'
    })

      .state('edit.node', {
        url: '*path',
        templateUrl: 'assets/app/website/edit.html',
        controller: 'WebsiteEditCtrl'
      })

    .state('account', {
      url: '/account',
      templateUrl: 'assets/app/account/sign-in.html',
      controller: 'SignInCtrl'
    })

    .state('logout', {
      url: '/logout',
      template: '',
      controller: 'SignOutCtrl'
    });



});
