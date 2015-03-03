
'use strict';

angular.module('ysh.components', ['ysh.utils'])

.directive('searchPanel', function(){
	return{
		templateUrl: 'templates/search.html'
	}
})
.directive('yshAmountCounter', function($compile){
	return {
		restrict: 'E',
		replace: true,
		template : '<div class="ysh-amount-counter">' +	
					'<button class="button button-small ion-plus"></button>'+
						'<span class="amount"></span>' +
					'<button class="button button-small ion-minus"></button>'+
					'</div>',
		compile: function(element, attrs){
			var plus = angular.element(element.find('button')[0]);
			var reduce = angular.element(element.find('button')[1]);
			plus.attr('ng-click', attrs.onAdd);
			reduce.attr('ng-click', attrs.onReduce);
			element.find('span').text('{{' + attrs.value + '}}');
		}
	}
})
.directive('yshPriceBlock', function(){
	return {
		restrict: 'E',
		replace : true,
		scope : {
			origPrice : '=',
			index : '='
		},
		template: '<div class="ysh-price-block">' + 
					'<span class="original ysh-ware-price ysh-right">￥{{origPrice}}</span>' +
					'<span class="reduced ysh-right" ng-show="enabled">￥{{redPrice}}</span>' +
					'</div>',
		link : function(scope, element, attrs){
			scope.enabled = false;
			scope.$on("codeAccepted", function (event, args) {	
				if (scope.index == Object.keys(args)[0]){
					scope.redPrice = args[scope.index]
					angular.element(element[0].querySelector('.original')).removeClass('ysh-ware-price').addClass('invalid ysh-small-font');
					scope.enabled = true;
					angular.element(element[0].querySelector('.reduced')).removeClass('disabled').addClass('ysh-ware-price');
				}
			});
		}
	}
})
.filter('searchFilter', function(){
	return function(input, key){
		if (!key){
			return input;
		}
		return input.filter(function(item){
			if (item.title == key){
				return item;
			}
		});
		return [input[key]];
	}
});
