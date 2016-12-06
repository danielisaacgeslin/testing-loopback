(() => {
    'use strict';
    angular.module('app.login', []).config(config);

    function config($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('/login', {
            url: '/login',
            templateUrl: 'login/login.html',
            controller: 'loginController',
            controllerAs: 'vm'
        });
    }
})();
