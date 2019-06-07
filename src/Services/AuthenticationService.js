import axios from 'axios';
import Common from '../Consts/Common';

class AuthenticationService{
    static login (params) {
        return axios.post(Common.apiUrl + '/auth/login', params);
    }

    static signup (params) {
        return axios.post(Common.apiUrl + '/auth/signup', params);
    }

    static verify(params){
        return axios.post(Common.apiUrl + '/auth/verify', params);
    }

    static forgot(params){
        return axios.post(Common.apiUrl + '/auth/forgot', params);
    }

    static reset(params){
        return axios.post(Common.apiUrl + '/auth/reset', params);
    }

    static sendEmailVerify(params){
        return axios.post(Common.apiUrl + '/auth/active', params);
    }

    static loginFacebook(params){
        return axios.post(Common.apiUrl + '/auth/facebook', params);
    }

    static checkLogon(){
        const authStr = 'Bearer '.concat(this.getToken());
        return axios.get(Common.apiUrl + '/auth/check', { headers: { Authorization: authStr }});
    }

    static getToken(){
        let token = localStorage.getItem(Common.tokenStorage);
        if(token && JSON.parse(token)){
            token = JSON.parse(token);
            if(token && token.token){
                return token.token;
            }
        }
        return null;
    }

    static getUserLoginInfo(){
        let token = localStorage.getItem(Common.tokenStorage);
        if(token && JSON.parse(token)){
            token = JSON.parse(token);
            if(token){
                return token.userInfo;
            }
        }
        return null;
    }

    static setToken(token){
        localStorage.setItem(Common.tokenStorage, JSON.stringify(token));
    }

    static removeToken(){
        localStorage.removeItem(Common.tokenStorage);
    }
}

export default AuthenticationService;