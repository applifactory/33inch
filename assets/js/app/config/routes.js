app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlRouterProvider.otherwise("/app");

  var userResolver = function(AuthService, $state, $rootScope) {
    return AuthService.me().then(function(me){
      $rootScope.currentUser = me.user;
      return me.user;
    }, function(){
      $state.go('sign-in');
    });
  };

  $stateProvider

    .state('app', {
      url: '/app',
      templateUrl: 'assets/app/index.html',
      resolve: {
        user: userResolver,
        bodyClass: function($rootScope) {
          $rootScope.bodyClass = 'app';
        }
      },
      redirectTo: 'app.list',
      controller: 'AppController'
    })

      .state('app.list', {
        url: '/list',
        templateUrl: 'assets/app/list.html',
        resolve: {
          websites: function(WebsitesService, $stateParams) {
            return WebsitesService.getAll();
          }
        },
        controller: 'WebsitesListController'
      })

      .state('app.details', {
        url: '/details/:link',
        templateUrl: 'assets/app/details/index.html',
        abstract: true,
        resolve: {
          website: function(WebsitesService, $stateParams) {
            return WebsitesService.get($stateParams.link);
          }
        },
        controller: 'WebsiteDetailsController'
      })
        .state('app.details.visibility', {
          url: '/visibility',
          templateUrl: 'assets/app/details/visibility.html',
          controller: 'WebsiteDetailsVisibilityController'
        })
        .state('app.details.collaborate', {
          url: '/collaborate',
          templateUrl: 'assets/app/details/collaborate.html',
          controller: 'WebsiteDetailsCollaborateController'
        })
        .state('app.details.settings', {
          url: '/settings',
          templateUrl: 'assets/app/details/settings.html',
          controller: 'WebsiteDetailsSettingsController'
        })
      .state('app.account', {
        url: '/account',
        templateUrl: 'assets/app/account/account/index.html',
      })
      .state('app.profile', {
        url: '/profile',
        templateUrl: 'assets/app/account/profile/index.html',
        redirectTo: 'app.profile.data'
      })
        .state('app.profile.data', {
          url: '/data',
          templateUrl: 'assets/app/account/profile/data.html',
          controller: 'ProfileDataController'
        })
        .state('app.profile.password', {
          url: '/password',
          templateUrl: 'assets/app/account/profile/password.html',
          controller: 'ProfilePasswordController'
        })

    //  Editor
    .state('edit', {
      url: '/app/:link',
      abstract: true,
      templateUrl: 'assets/app/website/editor-container.html',
      controller: 'WebsiteEditorContainerCtrl',
      resolve: {
        user: userResolver,
        bodyClass: function($rootScope) {
          $rootScope.bodyClass = 'editor';
        }
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
      controller: 'SignInCtrl',
      resolve: {
        bodyClass: function($rootScope) {
          $rootScope.bodyClass = 'app';
        }
      }
    })
    .state('sign-up', {
      url: '/sign-up',
      templateUrl: 'assets/app/account/sign-up.html',
      controller: 'SignUpCtrl',
      resolve: {
        bodyClass: function($rootScope) {
          $rootScope.bodyClass = 'app';
        }
      }
    })
    .state('logout', {
      url: '/logout',
      template: '',
      controller: 'SignOutCtrl'
    });



});
