import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

var cancel=null;
var CancelToken = axios.CancelToken;

class TypeService{
    static getTypes () {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/type/getall', { headers: { Authorization: authStr }});
    }

    static getTypesWithSorting(params){
        //Cancel previous typing
        if (cancel != null) {
            cancel();
        }
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/type/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
    }

    static addType(params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/type/add',params, { headers: { Authorization: authStr }});
    }

    static getType(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/type/get/'+id, { headers: { Authorization: authStr }});
    }

    static editType(id, params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/type/update/'+id,params, { headers: { Authorization: authStr }});
    }

    static deleteType(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.delete(Common.apiUrl + '/type/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default TypeService;