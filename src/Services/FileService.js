import axios from 'axios';
import Common from '../Consts/Common';

class FileService{
    static uploadFile (token, file) {
        const authStr = 'Bearer '.concat(token);
        return axios.post(Common.apiUrl + '/file/upload', file, { headers: { Authorization: authStr}});
    }
}

export default FileService;