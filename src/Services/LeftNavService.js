import axios from 'axios';
import Common from '../Consts/Common';

class LeftNavService{
    getLeftNavs (token) {
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/leftnav/getall', { headers: { Authorization: authStr }});
    }

    getLeftNavsWithSorting(token, params){
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/leftnav/getsort', 
        { 
            headers: { Authorization: authStr },
            params: params
        });
    }

    addLeftNav(params, token){
        const authStr = 'Bearer '.concat(token);
        return axios.post(Common.apiUrl + '/leftnav/add',params, { headers: { Authorization: authStr }});
    }

    getLeftNav(id, token){
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/leftnav/get/'+id, { headers: { Authorization: authStr }});
    }

    editLeftNav(params, token){
        const authStr = 'Bearer '.concat(token);
        return axios.put(Common.apiUrl + '/leftnav/edit',params, { headers: { Authorization: authStr }});
    }

    deleteLeftNav(id, token){
        const authStr = 'Bearer '.concat(token);
        return axios.delete(Common.apiUrl + '/leftnav/delete/'+id, { headers: { Authorization: authStr }});
    }
}

export default LeftNavService;