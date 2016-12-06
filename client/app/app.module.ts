(() => {
    'use strict';
    angular.module('app', ['app.core', 'app.login', 'app.main']).config(config).constant('constants', constants());

    function config($urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('*');
        $urlRouterProvider.otherwise('/');
    }

    function constants() {
        return {
            API: 'http://localhost:4000/api/'
        };
    }

})();
