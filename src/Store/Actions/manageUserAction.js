import ErrorHandlerService from '../../Services/ErrorHandlerService';
import UserService from '../../Services/UserService';
import FileService from '../../Services/FileService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import axios from 'axios';

export const createUser=(user)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete user['repassword'];
        if(user.avatar){
            let formData = new FormData();
            formData.append('file', user.avatar);
            FileService.uploadFile(formData).then((res)=>{
                user.avatar = res.data;
                UserService.addUser(user).then((res)=>{
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    toast("Added user successfully.", { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'CREATE_USER', user});
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
            user.avatar = "";
            UserService.addUser(user).then((res)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                toast("Added user successfully.", { type: toast.TYPE.SUCCESS });
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
            let users = res.data;
            users.totalPage=Math.ceil(res.data.countAll/Common.pageSize);
            users.currentPage=params.pageNumber;
            users.search=params.search;
            users.orderBy=params.orderBy;
            users.sort=params.sort;
            users.currentArrow=params.currentArrow;
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
            axios.all([
                UserService.getAllRoles(),
                UserService.getUserById(id)
            ]).then(axios.spread((role, userData)=>{
                let isShow = false;
                dispatch({type: 'TOOGLE_LOADING', isShow});
                let res = {};
                res.user = userData.data;
                res.roles = role.data;
                dispatch({type: 'OPEN_UPDATE_USER_DIALOG', res});
            })).catch(function (error) {
                let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
        else{
            UserService.getAllRoles().then((res)=>{
                let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                let roles = res.data;
                dispatch({type: 'OPEN_UPDATE_USER_DIALOG', roles});
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

export const updateUserDispatch=(user)=>{
    return (dispatch) =>{
        let isShow = true;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
        UserService.updateUser(user).then((res)=>{
            let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
            toast("Updated user successfully.", { type: toast.TYPE.SUCCESS });
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

export const deleteUserDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
        UserService.deleteUser(id).then((res)=>{
            let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
            toast("Deleted user successfully.", { type: toast.TYPE.SUCCESS });
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