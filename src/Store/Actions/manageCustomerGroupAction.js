import ErrorHandlerService from '../../Services/ErrorHandlerService';
import ManageCustomerGroupService from '../../Services/ManageCustomerGroupService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';
import FileService from '../../Services/FileService';

export const createCustomerGroup=(customerGroup)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete customerGroup._id;
        customerGroup.createdBy = AuthenticationService.getUserLoginInfo().id;
        customerGroup.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(customerGroup.image){
            let formData = new FormData();
            formData.append('image', customerGroup.image);
            FileService.uploadImage(formData).then((res)=>{
                let customerGroupTmp = Object.assign(customerGroup, {});
                customerGroupTmp.image = res.data.data;
                ManageCustomerGroupService.addCustomerGroup(customerGroupTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("ADD_CUSTOMER_GROUP_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_CUSTOMER_GROUP', customerGroup});
                    dispatch(getCustomerGroups());
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
            customerGroup.image = "";
            ManageCustomerGroupService.addCustomerGroup(customerGroup).then((res)=>{
                toast(i18n.t("ADD_CUSTOMER_GROUP_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_CUSTOMER_GROUP', customerGroup});
                dispatch(getCustomerGroups());
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

export const getCustomerGroups=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_CUSTOMER_GROUP_DATA'});
        let state = getState().manageCustomerGroup;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        ManageCustomerGroupService.getCustomerGroupsWithSorting(params).then((res)=>{
            if(res.data){
                let customerGroups = {};
                customerGroups.data = res.data.data.data;
                customerGroups.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                customerGroups.currentPage=params.pageNumber;
                customerGroups.search=params.search;
                customerGroups.orderBy=params.orderBy;
                customerGroups.sort=params.sort;
                customerGroups.currentArrow=params.currentArrow;
                customerGroups.countAll=res.data.data.countAll;
                dispatch({type: 'GET_CUSTOMER_GROUPS', customerGroups});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateCustomerGroupDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            ManageCustomerGroupService.getCustomerGroup(id).then((res)=>{
                if(res.data){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    let data = {};
                    data.customerGroup = res.data.data;
                    dispatch({type: 'OPEN_UPDATE_CUSTOMER_GROUP_DIALOG', data});
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
            dispatch({type: 'OPEN_UPDATE_CUSTOMER_GROUP_DIALOG'});
        }
    }
}

export const updateCustomerGroupDispatch=(customerGroup)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        customerGroup.modifiedOn =  new Date();
        customerGroup.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(customerGroup.image){
            let formData = new FormData();
            formData.append('image', customerGroup.image);
            FileService.uploadImage(formData).then((res)=>{
                let customerGroupTmp = Object.assign(customerGroup, {});
                customerGroupTmp.image = res.data.data;
                ManageCustomerGroupService.editCustomerGroup(customerGroupTmp._id, customerGroupTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("UPDATE_CUSTOMER_GROUP_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_CUSTOMER_GROUP', customerGroup});
                    dispatch(getCustomerGroups());
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
            ManageCustomerGroupService.editCustomerGroup(customerGroup._id, customerGroup).then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                toast(i18n.t("UPDATE_CUSTOMER_GROUP_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_CUSTOMER_GROUP', customerGroup});
                dispatch(getCustomerGroups());
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

export const deleteCustomerGroupDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        ManageCustomerGroupService.deleteCustomerGroup(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_CUSTOMER_GROUP_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getCustomerGroups(1));
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