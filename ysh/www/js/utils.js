
'use strict';
angular.module('ysh.utils', [])
.factory('sessionProvider',['$cacheFactory', SessionProvider]);

function SessionProvider($cacheFactory){
	return {
		put : function(key, value){
			if (typeof value !== 'string'){
				value = JSON.stringify(value);
			}
			sessionStorage.setItem(key, value);
		},
		get : function(key){
			return sessionStorage.getItem(key);
		},
		clear : function(){
			sessionStorage.clear();
		}
	}
}
