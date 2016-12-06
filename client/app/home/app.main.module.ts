(() => {
    'use strict';
    angular.module('app.main', []).config(config);

    function config($stateProvider: ng.ui.IStateProvider) {
        $stateProvider.state('/', {
            url: '/',
            templateUrl: 'home/main.html',
            controller: 'mainController',
            controllerAs: 'vm'
        }).state('/second', {
            url: '/second',
            templateUrl: 'home/second.html',
            controller: 'secondController',
            controllerAs: 'vm'
        });
    }
})();
