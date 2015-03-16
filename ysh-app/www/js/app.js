'use strict';

angular.module('ysh', ['ionic', 'ysh.controllers.main', 'ysh.controllers.member', 'ysh.models', 'ysh.config'])

.run(function($ionicPlatform, $ionicModal, $rootScope, $state, $log, sessionProvider, memberModelProvider, default_logo) {
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
  $rootScope.showControls = true;
  $rootScope.logo = default_logo;
  
  //initialize login modal
  $ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $rootScope
  }).then(function(modal) {
		$rootScope.modal = modal;
  });
  
  $rootScope.loginModal = {
	  loginData : {},
	  modus : 'login', //login|signin
	  showLogin : function(){
		this.modus = 'login';
	  },
	  showSignin : function(){
		this.modus = 'signin';
	  },
	  close : function(){
		$rootScope.modal.hide();
	  },
	  open : function(){
		$rootScope.modal.show(); 
	  },
	  doLogin : function() {
		memberModelProvider.login(this.loginData.username, this.loginData.password).then(function(data){
			if(memberModelProvider.loginStatus){
				sessionProvider.put('credential', this.loginData);
				$rootScope.loginModal.close();
				$state.go('app.member');
			}else{
				$log.info('login failed');
			}
		});
	  }
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
	.state('app.member', {
      url: "/member",
      views: {
        'menuContent': {
			templateUrl: "templates/member/main.html",
			controller : 'MemberCtrl'
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
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');
});
