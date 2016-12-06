(() => {
    angular.module('app.login').factory('loginService', loginService);

    loginService.$inject = ['$http', '$q', 'constants'];
    function loginService($http: ng.IHttpService, $q: ng.IQService, constants) {
        return {
            login: login,
            logout: logout
        };

        function login(params: { email: string, password: string }): ng.IPromise<boolean> {
            const defer: ng.IDeferred<boolean> = $q.defer();
            $http.post(constants.API.concat('Users/login'), params).then(
                (response: any) => {
                    sessionStorage.setItem('token', response.data.id);
                    defer.resolve(true);
                },
                error => {
                    defer.resolve(false);
                }
            );
            return defer.promise;
        }

        function logout(): boolean {
            sessionStorage.clear();
            return true;
        }

    };
})();