import axios from 'axios';
import Common from '../Consts/Common';

class UserService{
    static addUser (token, params) {
        const authStr = 'Bearer '.concat(token);
        return axios.post(Common.apiUrl + '/user/add', params, { headers: { Authorization: authStr }});
    }

    static getUsers (token) {
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/user/getall', { headers: { 
            'Content-Type': 'application/json;charset=utf-8', 
            'Accept': 'application/json',
            Authorization: authStr }});
    }
}

export default UserService;