//services for REST access

'use strict';
angular.module('ysh.services', ['ysh.config'])
.service('channelServiceProvider', ['$http','service_url', ChannelService])
.service('adServiceProvider', ['$http','service_url', AdService])
.service('brandServiceProvider', ['$http','service_url', BrandService])
.service('wareServiceProvider', ['$http','service_url', WareService])
.service('memberServiceProvider', ['$http','service_url','default_dealer_rank', MemberService]);

function ChannelService($http, service_url){	
	//this.url = "js/json/channels.json";
	this.url = service_url + 'channels/';
	
	this.get = function(){
		return $http.get(this.url);
	};
	
}

function AdService ($http, service_url){
	//this.url = "js/json/ads.json";
	this.url =  service_url + 'ads/';
	this.get = function(){
		return $http.get(this.url);
	};
	this.post = function (){};
	this.put = function (){};
	this.errorCallback = function (respone){};
}

function BrandService ($http, service_url){
	//this.url = "js/json/brands.json";
	this.url =  service_url + 'brands/';
	
	this.getBrandsByChannel = function(channel){
		var _url = this.url + 'cate/' + channel;
		return $http.get(_url);
	}
	
	this.getBrand = function(id){
		var _url = this.url + id;
		return $http.get(_url);
	}
}

function WareService($http, service_url){
	//this.url = "js/json/wares.json"
	this.url = service_url + 'wares/';
	
	this.getWaresByBrand = function(brandId){
		var _url = this.url + 'brand/' + brandId + '/';
		return $http.get(_url);
	};

	this.getWareById = function(id){
		var _url = this.url + id + '/';
		return $http.get(_url);
	};

	this.findWaresByTitle = function(title) {
		var _url = this.url + 'search/' + title + '/';
		return $http.get(_url);
	} 
	
}

function MemberService($http, service_url, default_dealer_rank){
	//this.url = "js/json/users.json"
	this.url = service_url + 'members/';
	
	this.getDealersByRank = function (top){
		if(isNaN(parseInt(top))){
			top = default_user_rank;
		};
		var _url = this.url + 'dealers/rank/' + top;
		return $http.get(_url);
	};
	this.login = function(username, password){
		var _url = this.url + 'account/login?name=' + username + '&pass=' + password;
		return $http.get(_url);
	};
	this.signin = function(username, password){
		var _url = this.url + 'account/';
		var payload = $.param({"name" : username, "pass" : password});
		return $http.post(_url, payload);
	};
}
