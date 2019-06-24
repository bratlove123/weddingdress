import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

var cancel=null;
var CancelToken = axios.CancelToken;

class UserService{   
    constructor(){
    }

    static addUser (params) {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/user/add', params, { headers: { Authorization: authStr }});
    }

    static getUsers () {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/user/getall', { headers: { Authorization: authStr }});
    }

    static getUserById (id) {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/user/get/' + id, { headers: { Authorization: authStr }});
    }

    static updateUser (params) {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/user/update/' + params._id, params, { headers: { Authorization: authStr }});
    }

    static deleteUser(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.delete(Common.apiUrl + '/user/delete/'+id, { headers: { Authorization: authStr }});
    }

    static toggleActiveUser(id, params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/user/active/'+id, params,  { headers: { Authorization: authStr }});
    }

    static getUsersWithSorting(params){
        //Cancel previous typing
        if (cancel != null) {
            cancel();
        }
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/user/getsort',{
            headers: { Authorization: authStr },
            params: params
            ,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
    }

    static getAllRolesById(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/user/roles/' + id, { headers: { Authorization: authStr }});
    }
}

export default UserService;