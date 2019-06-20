import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

class FileService{
    static uploadImage (file) {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/upload/image', file, { headers: { Authorization: authStr}});
    }
}

export default FileService;