import axios from 'axios';
import Common from '../Consts/Common';

class AuthenticationService{
    login (params) {
        return axios.post(Common.apiUrl + '/auth/login', params);
    }

    signup (params) {
        return axios.post(Common.apiUrl + '/auth/register', params);
    }

    verify(params){
        return axios.get(Common.apiUrl + '/auth/confirm?code='+
        params.code+"&userId="+params.userId);
    }

    forgot(params){
        return axios.post(Common.apiUrl + '/auth/forgot', params);
    }

    reset(params){
        return axios.post(Common.apiUrl + '/auth/reset', params);
    }

    loginFacebook(params){
        return axios.post(Common.apiUrl + '/auth/facebook', params);
    }

    checkLogon(token){
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/auth/check', { headers: { Authorization: authStr }});
    }

    getToken(){
        let token = localStorage.getItem(Common.tokenStorage);
        if(token && JSON.parse(token)){
            token = JSON.parse(token);
            if(token && token.auth_token){
                return token.auth_token;
            }
        }
        return null;
    }

    getUserLoginInfo(){
        let token = localStorage.getItem(Common.tokenStorage);
        if(token && JSON.parse(token)){
            token = JSON.parse(token);
            if(token){
                return token;
            }
        }
        return null;
    }

    setToken(token){
        localStorage.setItem(Common.tokenStorage, JSON.stringify(token));
    }

    removeToken(){
        localStorage.removeItem(Common.tokenStorage);
    }
}

export default AuthenticationService;