import ErrorHandlerService from '../../Services/ErrorHandlerService';
import UserService from '../../Services/UserService';
import FileService from '../../Services/FileService';
import RoleService from '../../Services/RoleService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import axios from 'axios';
import i18n from '../../Consts/i18n';

export const createUser=(user)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete user['repassword'];
        user.createdBy = AuthenticationService.getUserLoginInfo().id;
        user.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(user.image){
            let formData = new FormData();
            formData.append('image', user.image);
            FileService.uploadImage(formData).then((res)=>{
                let userTmp = Object.assign(user, {});
                userTmp.image = res.data.data;
                UserService.addUser(userTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("ADD_USER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_USER', user});
                    dispatch(getUsers());
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
            user.image = "";
            UserService.addUser(user).then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                toast(i18n.t("ADD_USER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_USER', user});
                dispatch(getUsers());
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

export const getUsers=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) =>{
        dispatch({type: 'SHOW_LOADING_USER_DATA'});
        let state = getState().manageUser;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };

        UserService.getUsersWithSorting(params).then((res)=>{
            let users = {};
            users.data = res.data.data.data;
            users.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
            users.currentPage=params.pageNumber;
            users.search=params.search;
            users.orderBy=params.orderBy;
            users.sort=params.sort;
            users.currentArrow=params.currentArrow;
            users.countAll=res.data.data.countAll;
            dispatch({type: 'GET_USERS', users});
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateUserDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
            dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){

                UserService.getUserById(id).then((userData)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                let res = {};
                res.user = userData.data.data;
                dispatch({type: 'OPEN_UPDATE_USER_DIALOG', res});
            }).catch(function (error) {
                let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
        else{
            let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
            dispatch({type: 'OPEN_UPDATE_USER_DIALOG'});
        }
    }
}

export const openUpdatePermissionDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
            dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            axios.all([
                UserService.getAllRolesById(id),
                RoleService.getRoleGroups()
            ]).then(axios.spread((rolesOfUser, allRoles)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                let res = {};
                res.rolesOfUser = rolesOfUser.data.data;
                res.allRoles = allRoles.data.data;
                res.id = id;
                dispatch({type: 'OPEN_UPDATE_PERMISSION_DIALOG', res});
            })).catch(function (error) {
                let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
            });
        }

    }
}

export const updateUserDispatch=(user)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        user.modifiedOn =  new Date();
        user.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        if(!user.image){
            UserService.updateUser(user).then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                toast(i18n.t("UPDATE_USER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                dispatch({type: 'UPDATE_USER', user});
                dispatch(getUsers());
            }).catch(function (error) {
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
        else{
            let formData = new FormData();
            formData.append('image', user.image);
            FileService.uploadImage(formData).then((res)=>{
                let userTmp = Object.assign(user, {});
                userTmp.image = res.data.data;
                UserService.updateUser(userTmp).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast(i18n.t("UPDATE_USER_SUCCESS"), { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'UPDATE_USER', user});
                    dispatch(getUsers());
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
    }
}

export const deleteUserDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
        UserService.deleteUser(id).then((res)=>{
            let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_USER_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getUsers());
        }).catch(function (error) {
            let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const toggleActiveDispatch=(id, isActive, isEmail)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        UserService.toggleActiveUser(id, isEmail?{isConfirmEmail: !isActive}:{isActive: !isActive}).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("TOOGLE_ACTIVE_USER_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getUsers());
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