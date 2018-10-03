import axios from 'axios';
import Common from '../Consts/Common';

class ProductService{
    getProducts (token) {
        const authStr = 'Bearer '.concat(token);
        return axios.get(Common.apiUrl + '/product/GetProducts', { headers: { Authorization: authStr }});
    }
}

export default ProductService;