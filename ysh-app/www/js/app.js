'use strict';

angular.module('ysh', ['ionic', 'ysh.controllers.main', 'ysh.controllers.member', 'ysh.models'])

.run(function($ionicPlatform, $ionicModal, $rootScope, $log, sessionProvider, memberModelProvider) {
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
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
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
		cache: false,
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
	})
	.state('app.dealerteaser', {
		url: "/dealerteaser",
		views: {
			'menuContent': {
			templateUrl: "templates/dealerteaser.html",
			controller : 'WareCtrl'
		}
	  }
    })
	//dealership states
	.state('dealer', {
		url: "/dealer",
		abstract: true,
		templateUrl: "templates/dealer/main.html"
	})
	.state('dealer.survey', {
      url: "/survey",
      views: {
        'surveyContent': {
			templateUrl: "templates/dealer/survey.html",
			controller : 'DealerCtrl'
		}
      }
    })
	//user center states
	.state('member',{
		url : "member",
		abstract: true,
		templateUrl: "templates/member/main.html",
	})
	.state('member.login', {
      url: "/login",
      views: {
        'memberContent': {
			templateUrl: "templates/member/login.html",
			controller : 'MemberCtrl'
		}
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
