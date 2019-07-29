import ErrorHandlerService from '../../Services/ErrorHandlerService';
import SupplierService from '../../Services/SupplierService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';
import FileService from '../../Services/FileService';

export const createSupplier=(supplier)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete supplier._id;
        supplier.createdBy = AuthenticationService.getUserLoginInfo().id;
        supplier.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(supplier.image){
            let formData = new FormData();
            formData.append('image', supplier.image);
            FileService.uploadImage(formData).then((res)=>{
                let supplierTmp = Object.assign(supplier, {});
                supplierTmp.image = res.data.data;
                SupplierService.addSupplier(supplierTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("ADD_SUPPLIER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_SUPPLIER', supplier});
                    dispatch(getSuppliers());
                }).catch(function (error) {
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
                });
            }).catch(function (error) {
                let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
        else{
            supplier.image = "";
            SupplierService.addSupplier(supplier).then((res)=>{
                toast(i18n.t("ADD_SUPPLIER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_SUPPLIER', supplier});
                dispatch(getSuppliers());
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
    }
}

export const getSuppliers=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_SUPPLIER_DATA'});
        let state = getState().manageSupplier;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        SupplierService.getSuppliersWithSorting(params).then((res)=>{
            if(res.data){
                let suppliers = {};
                suppliers.data = res.data.data.data;
                suppliers.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                suppliers.currentPage=params.pageNumber;
                suppliers.search=params.search;
                suppliers.orderBy=params.orderBy;
                suppliers.sort=params.sort;
                suppliers.currentArrow=params.currentArrow;
                suppliers.countAll=res.data.data.countAll;
                dispatch({type: 'GET_SUPPLIERS', suppliers});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateSupplierDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            SupplierService.getSupplier(id).then((res)=>{
                if(res.data){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    let data = {};
                    data.supplier = res.data.data;
                    dispatch({type: 'OPEN_UPDATE_SUPPLIER_DIALOG', data});
                }
            }).catch(function (error) {
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
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            dispatch({type: 'OPEN_UPDATE_SUPPLIER_DIALOG'});
        }
    }
}

export const updateSupplierDispatch=(supplier)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        supplier.modifiedOn =  new Date();
        supplier.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(supplier.image){
            let formData = new FormData();
            formData.append('image', supplier.image);
            FileService.uploadImage(formData).then((res)=>{
                let supplierTmp = Object.assign(supplier, {});
                supplierTmp.image = res.data.data;
                SupplierService.editSupplier(supplierTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("UPDATE_SUPPLIER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_SUPPLIER', supplier});
                    dispatch(getSuppliers());
                }).catch(function (error) {
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
                });
            }).catch(function (error) {
                let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
        else{
            supplier.image="";
            SupplierService.editSupplier(supplier._id, supplier).then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                toast(i18n.t("UPDATE_SUPPLIER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_SUPPLIER', supplier});
                dispatch(getSuppliers());
            }).catch(function (error) {
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
    }
}

export const deleteSupplierDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        SupplierService.deleteSupplier(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_SUPPLIER_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getSuppliers(1));
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