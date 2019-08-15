import ErrorHandlerService from '../../Services/ErrorHandlerService';
import ProductService from '../../Services/ProductService';
import ColorService from '../../Services/ColorService';
import TypeService from '../../Services/TypeService';
import SupplierService from '../../Services/SupplierService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';
import axios from 'axios';
import FileService from '../../Services/FileService';

export const createProduct=(product)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete product._id;
        delete product.del_arr;
        delete product.del_size_arr;
        product.createdBy = AuthenticationService.getUserLoginInfo().id;
        product.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        let requests = [];
        if(product.details && product.details.length > 0){
            for(let i=0;i<product.details.length;i++){
                delete product.details[i].imgSrcs;
                if(product.details[i].images && product.details[i].images.length > 0){
                    let formData = new FormData();
                    for(let j=0;j<product.details[i].images.length;j++){
                        formData.append('image', product.details[i].images[j]);
                    }
                    
                    requests.push(FileService.uploadImages(formData));
                }
                else{
                    requests.push(null);
                }
            }

            axios.all(requests).then((...res)=>{
                if(res && res.length > 0){
                    res =  res[0];
                    for(let k=0; k< res.length;k++){
                        if(res[k]){
                            product.details[k].images = res[k].data.data.map((e)=>{return e.filename});
                        }
                    }
                    console.log(product);
                    ProductService.addProduct(product).then((res)=>{
                        toast(i18n.t("ADD_PRODUCT_SUCCESS"), { type: toast.TYPE.SUCCESS });
                        dispatch({type: 'UPDATE_PRODUCT', product});
                        dispatch(getProducts());
                        let isShow = false;
                        dispatch({type: 'TOOGLE_LOADING', isShow});
                    }).catch(function (error) {
                        let isShow = false;
                        dispatch({type: 'TOOGLE_LOADING', isShow});
                        ErrorHandlerService.basicErrorHandler(error, function(){
                            dispatch({type: 'REDIRECT_TO_LOGIN'});
                        });
                    });
                }
            });
        }
        
        
    }
}

export const getProducts=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_PRODUCT_DATA'});
        let state = getState().manageProduct;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        ProductService.getProductsWithSorting(params).then((res)=>{
            if(res.data){
                let products = {};
                products.data = res.data.data.data;
                products.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                products.currentPage=params.pageNumber;
                products.search=params.search;
                products.orderBy=params.orderBy;
                products.sort=params.sort;
                products.currentArrow=params.currentArrow;
                products.countAll=res.data.data.countAll;
                dispatch({type: 'GET_PRODUCTS', products});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateProductDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            axios.all([
                ProductService.getProduct(id),
                ColorService.getColors(),
                TypeService.getTypes(),
                SupplierService.getSuppliers()
              ])
              .then(axios.spread((product, colors, types, suppliers) => {
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                let data = {};
                data.isEdit = true;
                product.data.data.details.map((el)=>{
                    el.imgSrcs = el.images;
                });
                data.product = product.data.data;
                //Get sizes
                if(product.data.data.typeId){
                    dispatch(getTypeById(product.data.data.typeId, product.data.data));
                }
                data.colors = colors.data.data;
                data.types = types.data.data;
                data.suppliers = suppliers.data.data;
                dispatch({type: 'OPEN_UPDATE_PRODUCT_DIALOG', data});
              })).catch(function (error) {
                ErrorHandlerService.basicErrorHandler(error, function(){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
                });
            });
        }
        else{
            axios.all([
                ColorService.getColors(),
                TypeService.getTypes(),
                SupplierService.getSuppliers()
              ])
              .then(axios.spread((colors, types, suppliers) => {
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                let data = {};
                data.colors = colors.data.data;
                data.types = types.data.data;
                data.suppliers = suppliers.data.data;
                dispatch({type: 'OPEN_UPDATE_PRODUCT_DIALOG', data});
              })).catch(function (error) {
                ErrorHandlerService.basicErrorHandler(error, function(){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
                });
            });
        }
    }
}

export const updateProductDispatch=(product)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        product.modifiedOn =  new Date();
        product.modifiedBy = AuthenticationService.getUserLoginInfo().id;

        let requests = [];
        if(product.details && product.details.length > 0){
            for(let i=0;i<product.details.length;i++){
                delete product.details[i].imgSrcs;
                if(product.details[i].images && product.details[i].images.length > 0 && typeof product.details[i].images[0] !== "string"){
                    let formData = new FormData();
                    for(let j=0;j<product.details[i].images.length;j++){
                        formData.append('image', product.details[i].images[j]);
                    }
                    
                    requests.push(FileService.uploadImages(formData));
                }
                else{
                    requests.push(null);
                }
            }

            axios.all(requests).then((...res)=>{
                if(res && res.length > 0){
                    res =  res[0];
                    for(let k=0; k< res.length;k++){
                        if(res[k]){
                            product.details[k].images = res[k].data.data.map((e)=>{return e.filename});
                        }
                    }
                    console.log(product);
                    ProductService.editProduct(product._id, product).then((res)=>{
                        toast(i18n.t("UPDATE_PRODUCT_SUCCESS"), { type: toast.TYPE.SUCCESS });
                        dispatch({type: 'UPDATE_PRODUCT', product});
                        dispatch(getProducts());
                        let isShow = false;
                        dispatch({type: 'TOOGLE_LOADING', isShow});
                    }).catch(function (error) {
                        let isShow = false;
                        dispatch({type: 'TOOGLE_LOADING', isShow});
                        ErrorHandlerService.basicErrorHandler(error, function(){
                            dispatch({type: 'REDIRECT_TO_LOGIN'});
                        });
                    });
                }
            });
        }
    }
}

export const deleteProductDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        ProductService.deleteProduct(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_PRODUCT_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getProducts(1));
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const getTypeById=(id, product)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        TypeService.getType(id).then((type)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            dispatch({type: 'GET_TYPE_BY_ID', typeData: {sizes: type.data.data.sizes, product: product}});
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const resetState=()=>{
    return (dispatch)=>{
        dispatch({type: 'RESET_STATE'});
    }
}