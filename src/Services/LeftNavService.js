import axios from 'axios';
import Common from '../Consts/Common';

class LeftNavService{
    static getLeftNavs (token) {
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/leftnav/getall', { headers: { Authorization: authStr }});
    }

    static getLeftNavsWithSorting(token, params){
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/leftnav/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params
        });
    }

    static addLeftNav(params, token){
        const authStr = 'Bearer '.concat(token);
        return axios.post(Common.apiUrl + '/leftnav/add',params, { headers: { Authorization: authStr }});
    }

    static getLeftNav(id, token){
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/leftnav/get/'+id, { headers: { Authorization: authStr }});
    }

    static editLeftNav(params, token){
        const authStr = 'Bearer '.concat(token);
        return axios.put(Common.apiUrl + '/leftnav/edit',params, { headers: { Authorization: authStr }});
    }

    static deleteLeftNav(id, token){
        const authStr = 'Bearer '.concat(token);
        return axios.delete(Common.apiUrl + '/leftnav/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default LeftNavService;