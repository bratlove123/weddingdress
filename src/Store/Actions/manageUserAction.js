import AuthenticationService from '../../Services/AuthenticationService';
import ErrorHandlerService from '../../Services/ErrorHandlerService';
import UserService from '../../Services/UserService';
import FileService from '../../Services/FileService';
import { toast } from 'react-toastify';

export const createUser=(user)=>{
    return (dispatch, getState) => {
        let token = AuthenticationService.getToken();
        delete user['repassword'];
        if(user.avatar){
            let formData = new FormData();
            formData.append('file', user.avatar);
            FileService.uploadFile(token, formData).then((res)=>{
                user.avatar = res.data;
                UserService.addUser(token, user).then((res)=>{
                    toast("Added user successfully.", { type: toast.TYPE.SUCCESS });
                    dispatch({type: 'CREATE_USER', user});
                    dispatch(getUsers());
                }).catch(function (error) {
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
                });
            }).catch(function (error) {
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
        else{
            user.avatar = "";
            UserService.addUser(token, user).then((res)=>{
                toast("Added user successfully.", { type: toast.TYPE.SUCCESS });
                dispatch({type: 'CREATE_USER', user});
                dispatch(getUsers());
            }).catch(function (error) {
                ErrorHandlerService.basicErrorHandler(error, function(){
                    dispatch({type: 'REDIRECT_TO_LOGIN'});
                });
            });
        }
    }
}

export const getUsers=()=>{
    return (dispatch, getState) =>{
        let token  = AuthenticationService.getToken();
        UserService.getUsers(token).then((res)=>{
            let users = res.data;
            dispatch({type: 'GET_USERS', users});
        });
    }
}

export const openUpdateUserDialog=(id)=>{
    return (dispatch, getState) =>{
        dispatch({type: 'OPEN_UPDATE_USER_DIALOG', id});
    }
}