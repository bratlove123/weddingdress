import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

var cancel=null;
var CancelToken = axios.CancelToken;

class SupplierService{
    static getSuppliers () {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/supplier/getall', { headers: { Authorization: authStr }});
    }

    static getSuppliersWithSorting(params){
        //Cancel previous typing
        if (cancel != null) {
            cancel();
        }
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/supplier/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        });
    }

    static addSupplier(params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/supplier/add',params, { headers: { Authorization: authStr }});
    }

    static getSupplier(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.get(Common.apiUrl + '/supplier/get/'+id, { headers: { Authorization: authStr }});
    }

    static editSupplier(id, params){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.put(Common.apiUrl + '/supplier/update/'+id,params, { headers: { Authorization: authStr }});
    }

    static deleteSupplier(id){
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.delete(Common.apiUrl + '/supplier/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default SupplierService;