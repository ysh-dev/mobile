'use strict';

angular.module('ysh.controllers', ['ysh.utils','ysh.models','ysh.components'])

.controller('AppCtrl', function($ionicModal, $timeout, $scope, channelModelProvider, adModelProvider, userModelProvider) {
  
  if (!$scope.adsLoaded){
		$scope.adsLoaded = true;
		adModelProvider.loadAds().then(function(data) {
			$scope.newAds = adModelProvider.newAds;
			$scope.hotAds = adModelProvider.hotAds;
		});
  }
  
  if (!$scope.channelLoaded){		
		$scope.channelLoaded = true;
		channelModelProvider.loadChannels().then(function(data) {
			$scope.channels = channelModelProvider.channels;
		});
   };
   
  $scope.loadRanking = function(){
	  userModelProvider.loadUsersByRank().then(function(data){		  
		$scope.users = userModelProvider.usersByRank;
	  });
  };
  
})

.controller('ChannelCtrl', ['$scope','$state','$stateParams','brandModelProvider','sessionProvider',function($scope,$state,$stateParams,brandModelProvider,session){
		
		var selChannel = $stateParams.cId;
		
		if ($scope.channels){	
			$scope.currentChannel = $scope.channels[selChannel].title;
			var curChannel = {};
			curChannel[selChannel] = $scope.currentChannel;
			session.put('current_channel', curChannel);
		}else{
			$scope.currentChannel = JSON.parse(session.get('current_channel'))[selChannel];
		}
		
		brandModelProvider.loadBrandsByChannel(selChannel).then(function(data) {
			$scope.brands = brandModelProvider.brandsByChannel[selChannel];
		});
		
		$scope.goBrand = function(brandId, name){
			var curBrand = {};
			curBrand[brandId] = name;
			session.put('current_brand', curBrand);
			$state.go("app.brand",{"bId" : brandId});
		};
}])

.controller('BrandCtrl', ['$scope', '$state','$stateParams','wareModelProvider','sessionProvider',function($scope, $state, $stateParams, wareModel, session){
		var selBrand = $stateParams.bId;
		if (session.get('current_brand')){
			$scope.currentBrand = JSON.parse(session.get('current_brand'))[selBrand];
		}
		wareModel.loadWaresByBrand(selBrand).then(function(data){
			$scope.wares = wareModel.waresByBrand[selBrand];
		});
		$scope.goWare = function(wareId, title){
			var curWare = {};
			curWare[wareId] = title;
			session.put('current_ware', curWare);
			$state.go("app.ware",{"wId" : wareId});
		};
		$scope.doRefresh = function() {
			$state.go("app.brand",{"bId" : selBrand});
			$scope.$broadcast('scroll.refreshComplete');
		}; 
}])
.controller('WareCtrl', ['$scope', '$state', '$stateParams', 'wareModelProvider', 'sessionProvider', '$ionicScrollDelegate', function($scope, $state, $stateParams, wareModelProvider, session, $ionicScrollDelegate){
		var selWare = $stateParams.wId;
		$scope.currentWare = JSON.parse(session.get('current_ware'))[selWare];
		
		//TODO: load ware data from backend;
		
		$scope.showCert = function(){
			console.info('TODO: show cetification...');
		}
		$scope.goCheckout = function(){
			$state.go("app.checkout");
		};
		$scope.goApply = function(){
			console.info('TODO: start navigation for applying dealership...');
		};
		$scope.callSharePlugin = function(){
			console.info('TODO: call plugin to share the ware...');
		};
		$scope.images=["img/wares/w_01.jpg","img/wares/w_02.jpg","img/wares/w_03.jpg"];
		
		$scope.disableScolling = function(){
			$ionicScrollDelegate.scrollTop();
		}
}])
.controller('CheckoutCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', 'sessionProvider', function($scope, $state, $stateParams, $ionicPopup, session){
		$scope.code = {};
		$scope.codeAccepted = {};
		$scope.checkoutItems = [{"id" : "w_01", "title" : "商品名称以及描述","pic":"img/logo.png","brand":"品牌名称以及描述","orig_price":"28", "red_price":"", "norm":"L"}];
		$scope.amount = {};
		$scope.checkoutItems.forEach(function(ele){
			$scope.amount[ele.id] = 1;
		});

		$scope.doAdd = function(index){
			if ($scope.amount[index] < 99){
				$scope.amount[index]++;
			}
		};
		$scope.doReduce = function(index){
			if($scope.amount[index] > 1){
				$scope.amount[index]--;
			}
		};
		$scope.submitCode = function(itemId){
			if (!$scope.code[itemId]){
				return;
			}
			console.info('Code accepted :' + $scope.code[itemId]);
			$scope.codeAccepted[itemId] = true;
			for (var idx in $scope.checkoutItems){
				if($scope.checkoutItems[idx].id == itemId){
					$scope.checkoutItems[idx].red_price = parseInt($scope.checkoutItems[idx].orig_price * 0.7);
					var msg = {};
					msg[itemId] = $scope.checkoutItems[idx].red_price
					$scope.$broadcast("codeAccepted", msg);
					break;
				}
			}
		};
		
		$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '注意',
				template: '你还未输入代理商代码，你确定要以专柜价购买以上产品?',
				okText : '确定',
				okType : 'button-small button-calm',
				cancelText : '取消',
				cancelType : 'button-small'
				
			});
			confirmPopup.then(function(res) {
				if(res) {
					console.log('You are sure');
				} else {
					console.log('You are not sure');
				}
			});
		};
		
}]);
