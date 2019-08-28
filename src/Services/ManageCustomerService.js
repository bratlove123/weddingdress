import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

var cancel=null;
var CancelToken = axios.CancelToken;

class ManageCustomerService{
    static getCustomers () {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/customer/getall', { headers: { Authorization: authStr }});
    }

    static getCustomersWithSorting(params){
        //Cancel previous typing
        if (cancel != null) {
            cancel();
        }
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/customer/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
    }

    static addCustomer(params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/customer/add',params, { headers: { Authorization: authStr }});
    }

    static getCustomer(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/customer/get/'+id, { headers: { Authorization: authStr }});
    }

    static editCustomer(id, params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/customer/update/'+id,params, { headers: { Authorization: authStr }});
    }

    static deleteCustomer(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.delete(Common.apiUrl + '/customer/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default ManageCustomerService;