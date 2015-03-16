'use strict';

angular.module('ysh.controllers.main', ['ysh.utils','ysh.models','ysh.components','ysh.config'])


.controller('AppCtrl', ['$ionicModal', '$scope', 'channelModelProvider', 'adModelProvider', 'memberModelProvider', 'wareModelProvider', '$ionicHistory', 'default_logo', '$rootScope', '$state', '$ionicLoading', 'sessionProvider', function($ionicModal, $scope, channelModelProvider, adModelProvider, memberModelProvider, wareModelProvider, $ionicHistory, default_logo, $rootScope, $state, $ionicLoading, session) {

  $scope.showDetail = function(id){
	  $ionicLoading.show({
		template: 'Loading...'
	  });
	  $state.go("app.ware", {"wId" : id});
  }
  $scope.toggleStatus = 'newlist';
  
  $scope.toggleNewlist = function(){
	$scope.toggleStatus = 'newlist';
  }
  
  $scope.toggleHotlist = function(){
	$scope.toggleStatus = 'hotlist';
  }
  
  $scope.toggleRanking = function(){
	memberModelProvider.loadDealersByRank().then(function(data){		  
		$scope.dealers = memberModelProvider.dealersByRank;
	});
	$scope.toggleStatus = 'ranking';
  } 
  
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
  
  //initialize search modal
  $ionicModal.fromTemplateUrl('templates/search.html', {
		scope: $scope
  }).then(function(modal) {
		$scope.modal = modal;
  });
  $scope.searchModal = {
	key : '',
	hitlist : [],
	close : function(){
		this.key = '';
		$scope.modal.hide();
	},
	open : function(){
		this.hitlist = [];
		$scope.modal.show(); 
	},
	doSearch : function(){
		$ionicLoading.show({
			template: 'Searching...'
		});
		wareModelProvider.findWaresByTitle(this.key).then(function(data){
			$ionicLoading.hide();
			$scope.searchModal.hitlist = wareModelProvider.waresByTitle;
		});
	}  
  }
}])
.controller('ChannelCtrl', ['$scope','$rootScope','$state','$stateParams','brandModelProvider','sessionProvider',function($scope, $rootScope, $state, $stateParams,brandModelProvider,session){
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
.controller('BrandCtrl', ['$scope', '$rootScope', '$state','$stateParams','wareModelProvider','sessionProvider', function($scope, $rootScope, $state, $stateParams, wareModel, session){
		var selBrand = $stateParams.bId;
		if (session.get('current_brand')){
			$scope.currentBrand = JSON.parse(session.get('current_brand'))[selBrand];
		}
		wareModel.loadWaresByBrand(selBrand).then(function(data){
			$scope.wares = wareModel.waresByBrand[selBrand];
		});
		$scope.goWare = function(wareId, title){
			$state.go("app.ware",{"wId" : wareId});
		};
		$scope.doRefresh = function() {
			$state.go("app.brand",{"bId" : selBrand});
			$scope.$broadcast('scroll.refreshComplete');
		}; 
}])
.controller('WareCtrl', ['$scope', '$state', '$stateParams', 'wareModelProvider', '$ionicScrollDelegate', '$rootScope', '$ionicHistory', '$ionicLoading', function($scope, $state, $stateParams, wareModel, $ionicScrollDelegate, $rootScope, $ionicHistory, $ionicLoading){
		var selWare;
		if (selWare = $stateParams.wId){
			wareModel.findWareById(selWare).then(function(data){
				$scope.ware = wareModel.wareById;
				$scope.title = $scope.ware.title;
				$ionicLoading.hide();
			});	
		}
		$scope.showCert = function(){
			console.info('TODO: show cetification...');
		}
		$scope.goCheckout = function(){
			$state.go("app.checkout");
		};
		$scope.showDealerTeaser = function(){
			$state.go("app.dealerteaser");
		};
		$scope.goApply = function(){
			$state.go("dealer.survey");
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
		
}])
.controller('DealerCtrl', ['$scope', '$ionicPopover', '$state', function($scope, $ionicPopover, $state){
		$scope.cancel = function(){
			$state.go("app.dealerteaser");
		};
}]);
