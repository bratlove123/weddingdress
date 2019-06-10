import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

var cancel=null;
var CancelToken = axios.CancelToken;

class LeftNavService{
    static getLeftNavs () {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/leftnav/getall', { headers: { Authorization: authStr }});
    }

    static getLeftNavsWithSorting(params){
        //Cancel previous typing
        if (cancel != null) {
            cancel();
        }
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/leftnav/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
    }

    static addLeftNav(params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/leftnav/add',params, { headers: { Authorization: authStr }});
    }

    static getLeftNav(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/leftnav/get/'+id, { headers: { Authorization: authStr }});
    }

    static editLeftNav(id, params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/leftnav/update/'+id,params, { headers: { Authorization: authStr }});
    }

    static deleteLeftNav(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.delete(Common.apiUrl + '/leftnav/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default LeftNavService;