'use strict';

angular.module('ysh', ['ionic', 'ysh.controllers'])

.run(function($ionicPlatform, $ionicModal, $rootScope, $log, sessionProvider) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  //initialize login modal
  $ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $rootScope
  }).then(function(modal) {
		$rootScope.modal = modal;
  });
 
  $rootScope.loginData = {};
  
  $rootScope.closeLogin = function() {
		$rootScope.modal.hide();
  };
  $rootScope.login = function() {
	if (!sessionProvider.get('credential')){
		$rootScope.modal.show();
	} else{
		$log.info('User is already logged in!');
	}
  };
  $rootScope.doLogin = function() {
	$log.info('Doing login', $rootScope.loginData);
	sessionProvider.put('credential', $rootScope.loginData);
	$rootScope.closeLogin();
  };
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html",
		controller : 'SearchCtrl'
      }
    }
  })

  .state('app.main', {
    url: "/main",
    views: {
      'menuContent': {
        templateUrl: "templates/main.html",
		controller: 'AppCtrl'
	  }
    }
  })
  .state('app.channel', {
      url: "/channel/:cId",
      views: {
        'menuContent': {
			templateUrl: "templates/channel.html",
			controller : 'ChannelCtrl'
		}
      }
    })
  .state('app.brand', {
      url: "/brand/:bId",
      views: {
        'menuContent': {
			templateUrl: "templates/brand.html",
			controller : 'BrandCtrl'
		}
      }
    })
  .state('app.ware', {
      url: "/ware/:wId",
      views: {
        'menuContent': {
			templateUrl: "templates/ware.html",
			controller : 'WareCtrl'
		}
      }
    })
   .state('app.checkout', {
      url: "/checkout",
      views: {
        'menuContent': {
			templateUrl: "templates/checkout.html",
			controller : 'CheckoutCtrl'
		}
	 }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
