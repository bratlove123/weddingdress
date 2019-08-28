import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

var cancel=null;
var CancelToken = axios.CancelToken;

class ManageCustomerGroupService{
    static getCustomerGroups () {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/customergroup/getall', { headers: { Authorization: authStr }});
    }

    static getCustomerGroupsWithSorting(params){
        //Cancel previous typing
        if (cancel != null) {
            cancel();
        }
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/customergroup/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
    }

    static addCustomerGroup(params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/customergroup/add',params, { headers: { Authorization: authStr }});
    }

    static getCustomerGroup(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/customergroup/get/'+id, { headers: { Authorization: authStr }});
    }

    static editCustomerGroup(id, params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/customergroup/update/'+id,params, { headers: { Authorization: authStr }});
    }

    static deleteCustomerGroup(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.delete(Common.apiUrl + '/customergroup/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default ManageCustomerGroupService;