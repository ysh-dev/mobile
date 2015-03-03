//place to put down models

'use strict';

angular.module('ysh.models', ['ysh.services'])
.factory('channelModelProvider',['channelServiceProvider', ChannelModel])
.factory('adModelProvider',['adServiceProvider', AdModel])
.factory('brandModelProvider',['brandServiceProvider', BrandModel])
.factory('wareModelProvider', ['$q', 'wareServiceProvider', WareModel])
.factory('userModelProvider', ['$q', 'userServiceProvider', UserModel]);


function ChannelModel(channelServiceProvider){
	var channelModel = {
		channels : {},
		//+++++loadChannels()++++++
		loadChannels : function(){
			return channelServiceProvider.get().then(function(response) {
				response.data.forEach(function(elem){
					channelModel.channels[elem.id] = elem;
				});
			}, function(reason) {
				// do some processing
				return [];
			});
		}
	}
	return channelModel;
}

function AdModel(adServiceProvider){

	var adModel = {
		hotAds : [],
		newAds : [],
		//+++++loadAds()++++++
		loadAds : function(){
			return adServiceProvider.get().then(function(response) {
				adModel.hotAds = response.data.filter(function(elem){
					return elem.cate === "H";
				});
				adModel.newAds = response.data.filter(function(elem){
					return elem.cate === "N";
				});
	
			}, function(reason) {
				// do some processing
				return [];
			})	
		}
	};
	return adModel;
}

function BrandModel(brandServiceProvider){
	var brandModel = {
		brand : undefined,
		brandsByChannel : {},
		//+++++loadBrandsByChannel()++++++
		loadBrandsByChannel : function(channel){
			if (!this.brandsByChannel[channel]){		
				return brandServiceProvider.getBrandsByChannel(channel).then(function(response){
					brandModel.brandsByChannel[channel] = response.data;
				});
			}else{
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			}
		},
		loadBrand : function(id){
			return brandServiceProvider.getBrand(id).then(function(response){
				brandModel.brand = response.data;
			});
		}
	};
	return brandModel;
}

function WareModel($q, wareServiceProvider){
	var wareModel = {
		waresByBrand : {},
		loadWaresByBrand : function(brand){
			if (!this.waresByBrand[brand]){
				return wareServiceProvider.getWaresByBrand(brand).then(function(response){
					wareModel.waresByBrand[brand] = response.data;
				});
			}else{
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			};
		},
		waresByTitle : [],
		findWaresByTitle : function(title){
			return wareServiceProvider.findWaresByTitle(title).then(function(response){
				wareModel.waresByTitle =  response.data;
			});
		},
		wareById : {},
		findWareById : function(id){
			return wareServiceProvider.getWareById(id).then(function(response){
				wareModel.wareById = response.data[0];
			});
		}
	}
	return wareModel;
}

function UserModel($q, userServiceProvider){
	var userModel = {
		usersByRank : undefined,
		loadUsersByRank : function(){
			if (!this.usersByRank){
				return userServiceProvider.getUsersByRank(10).then(function(response){
					userModel.usersByRank = response.data;
				});
			}else{
				var deferred = $q.defer();
				deferred.resolve();
				return deferred.promise;
			}
		}
	}
	return userModel;
}

function CartModel(){
	
}

