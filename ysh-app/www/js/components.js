
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
})
//src from ionic-image-lazy-load.js
.directive('lazyScroll', ['$rootScope', '$timeout', 
    function($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {

                var scrollTimeoutId = 0;

                $scope.invoke = function () {
                    $rootScope.$broadcast('lazyScrollEvent');
                };

                $element.bind('scroll', function () {

                    $timeout.cancel(scrollTimeoutId);

                    // wait and then invoke listeners (simulates stop event)
                    scrollTimeoutId = $timeout($scope.invoke, 0);

                });


            }
        };
}])
.directive('imageLazySrc', ['$document', '$timeout', 
    function ($document, $timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attributes) {

                var deregistration = $scope.$on('lazyScrollEvent', function () {
                        //console.log('scroll');
                        if (isInView()) {
                            $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                            deregistration();
                        }
                    }
                );

                function isInView() {
                    var clientHeight = $document[0].documentElement.clientHeight;
                    var clientWidth = $document[0].documentElement.clientWidth;
                    var imageRect = $element[0].getBoundingClientRect();
                    return  (imageRect.top >= 0 && imageRect.bottom <= clientHeight) && (imageRect.left >= 0 && imageRect.right <= clientWidth);
                }

                // bind listener
                // listenerRemover = scrollAndResizeListener.bindListener(isInView);

                // unbind event listeners if element was destroyed
                // it happens when you change view, etc
                $element.on('$destroy', function () {
                    deregistration();
                });

                // explicitly call scroll listener (because, some images are in viewport already and we haven't scrolled yet)
                $timeout(function() {
                    if (isInView()) {
                        $element[0].src = $attributes.imageLazySrc; // set src attribute on element (it will load image)
                        deregistration();
                    }
                }, 500);
            }
        };
}]);
