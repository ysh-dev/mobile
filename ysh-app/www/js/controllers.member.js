'use strict';

angular.module('ysh.controllers.member', ['ysh.utils','ysh.models','ysh.components','ysh.config'])

.controller('MemberCtrl', ['$scope', '$log', '$state', 'sessionProvider', 'memberModelProvider', function($scope, $log, $state, sessionProvider, memberModelProvider){

  $scope.toggleLogin = true;//means login
  
  $scope.showLogin = function(){
	 $scope.toggleLogin = true;
  };
  $scope.showSignin = function(){
	 $scope.toggleLogin = false;
  };
  $scope.loginData = {};
  
  $scope.close = function(){
	  $state.go("app.main");
  }
  $scope.login = function() {
	if (sessionProvider.get('credential')){
		$log.info('User is already logged in!');
	}
  };
  $scope.doLogin = function() {
	memberModelProvider.login($scope.loginData.username, $scope.loginData.password).then(function(data){
		if(memberModelProvider.loginStatus){
			sessionProvider.put('credential', $scope.loginData);
			$scope.closeLogin();
		}else{
			$log.info('login failed');
		}
	});
  };
}])