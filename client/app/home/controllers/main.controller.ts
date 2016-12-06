(() => {
    'use strict';
    angular.module('app.main').controller('mainController', mainController);

    mainController.$inject = ['$scope'];
    function mainController($scope: any) {
        const vm = this;
        vm.test = 'testing this controller';
        vm.a = 0;
        vm.b = 0;
        vm.r = 0;

        $scope.sum = sum;

        _init();

        function _init(): void { }

        function sum(): void {
            vm.r = Number(vm.a) + Number(vm.b);
        }
    }
})();
