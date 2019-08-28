import ErrorHandlerService from '../../Services/ErrorHandlerService';
import ManageCustomerService from '../../Services/ManageCustomerService';
import ManageCustomerGroupService from '../../Services/ManageCustomerGroupService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';
import FileService from '../../Services/FileService';
import axios from 'axios';

export const createCustomer=(customer)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete customer._id;
        customer.createdBy = AuthenticationService.getUserLoginInfo().id;
        customer.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(customer.image){
            let formData = new FormData();
            formData.append('image', customer.image);
            FileService.uploadImage(formData).then((res)=>{
                let customerTmp = Object.assign(customer, {});
                customerTmp.image = res.data.data;
                customerTmp.sex = customerTmp.sex == 'true';
                ManageCustomerService.addCustomer(customerTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("ADD_CUSTOMER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_CUSTOMER', customer});
                    dispatch(getCustomers());
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
            customer.image = "";
            customer.sex = customer.sex == 'true';
            ManageCustomerService.addCustomer(customer).then((res)=>{
                toast(i18n.t("ADD_CUSTOMER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_CUSTOMER', customer});
                dispatch(getCustomers());
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

export const getCustomers=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_CUSTOMER_DATA'});
        let state = getState().manageCustomer;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        ManageCustomerService.getCustomersWithSorting(params).then((res)=>{
            if(res.data){
                let customers = {};
                customers.data = res.data.data.data;
                customers.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                customers.currentPage=params.pageNumber;
                customers.search=params.search;
                customers.orderBy=params.orderBy;
                customers.sort=params.sort;
                customers.currentArrow=params.currentArrow;
                customers.countAll=res.data.data.countAll;
                dispatch({type: 'GET_CUSTOMERS', customers});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateCustomerDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            axios.all([
                ManageCustomerService.getCustomer(id),
                ManageCustomerGroupService.getCustomerGroups()
              ])
              .then(axios.spread((customer, customerGroups) => {
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    let data = {};
                    data.customer = customer.data.data;
                    data.customerGroups = customerGroups.data.data;
                    data.isEdit = true;
                    dispatch({type: 'OPEN_UPDATE_CUSTOMER_DIALOG', data});
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
            ManageCustomerGroupService.getCustomerGroups().then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                let data = {};
                data.customerGroups = res.data.data;
                dispatch({type: 'OPEN_UPDATE_CUSTOMER_DIALOG', data});
            });
            
        }
    }
}

export const updateCustomerDispatch=(customer)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        customer.modifiedOn =  new Date();
        customer.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(customer.image){
            let formData = new FormData();
            formData.append('image', customer.image);
            FileService.uploadImage(formData).then((res)=>{
                let customerTmp = Object.assign(customer, {});
                customerTmp.image = res.data.data;
                ManageCustomerService.editCustomer(customerTmp._id, customerTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("UPDATE_CUSTOMER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_CUSTOMER', customer});
                    dispatch(getCustomers());
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
            ManageCustomerService.editCustomer(customer._id, customer).then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                toast(i18n.t("UPDATE_CUSTOMER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_CUSTOMER', customer});
                dispatch(getCustomers());
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

export const deleteCustomerDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        ManageCustomerService.deleteCustomer(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_CUSTOMER_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getCustomers(1));
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