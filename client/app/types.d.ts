interface ILoginService {
    login(params: { email: string, password: string }): ng.IPromise<boolean>
}