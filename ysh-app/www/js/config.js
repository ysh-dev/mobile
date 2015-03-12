//config information for the app

'use strict';
angular.module('ysh.config', [])
.constant('service_url', 'http://182.92.218.38:3000/')
//.constant('service_url', 'http://192.168.1.105:3000/')
.constant('default_user_rank', 10)
.constant('default_logo', '<img class="ysh-logo" src="img/default.png"/>');