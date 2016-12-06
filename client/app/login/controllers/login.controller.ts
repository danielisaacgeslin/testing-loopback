(() => {
    'use strict';
    angular.module('app.login').controller('loginController', loginController);

    loginController.$inject = ['$scope', 'loginService'];
    function loginController($scope: any, loginService: ILoginService) {
        const vm = this;
        vm.email = null;
        vm.password = null;

        vm.login = login;

        function login() {
            const email: string = vm.email;
            const password: string = vm.password;
            loginService.login({ email, password }).then(res => {
                console.log(res);
            });
        }
    }
})();
