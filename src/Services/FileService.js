import axios from 'axios';
import Common from '../Consts/Common';
import AuthenticationService from './AuthenticationService';

class FileService{
    static uploadFile (file) {
        const authStr = 'Bearer '.concat(AuthenticationService.getToken());
        return axios.post(Common.apiUrl + '/file/upload', file, { headers: { Authorization: authStr}});
    }
}

export default FileService;