import ErrorHandlerService from '../../Services/ErrorHandlerService';
import AuthenticationService from '../../Services/AuthenticationService';
import { toast } from 'react-toastify';
import i18n from '../../Consts/i18n';

export const signInDispatch=(login)=>{
    return (dispatch) => {
        AuthenticationService.login({userName: login.username, password: login.password}).then(res=>{
            AuthenticationService.setToken(res.data);
            let redirectToHome = true;
            dispatch({type: 'REDIRECT_TO_HOME', redirectToHome});
        }).catch(function (error) {
            
            ErrorHandlerService.loginErrorHandler(error, function(email){
                let res={};
                res.redirectToConfirm = true;
                res.email=email;
                dispatch({type: 'REDIRECT_TO_CONFIRM', res});
            });
        });
    }
}

export const loginFacebookCallbackDispatch=(response)=>{
    return (dispatch) => {
        if (response.status === 'connected') {
            AuthenticationService.loginFacebook({accessToken: response.authResponse.accessToken}).then((res)=>{
                AuthenticationService.setToken(res.data);
                let redirectToHome = true;
                dispatch({type: 'REDIRECT_TO_HOME', redirectToHome});
            })
            .catch(function (error) {
                ErrorHandlerService.errorWithMessageFromAPI(error);
            });
        } else if (response.status === 'not_authorized') {
            toast(i18n.t("CANNOT_LOGIN_FACEBOOK"), { type: toast.TYPE.ERROR });
        } else {
            toast("UNKNOWN_ERROR_LOGIN_FACEBOOK", { type: toast.TYPE.ERROR });
        }
    }
}

export const checkLoginStatus=()=>{
    return (dispatch) => {
        AuthenticationService.checkLogon().then(res=>{
            let redirectToHome = true;
            dispatch({type: 'REDIRECT_TO_HOME', redirectToHome});
        }).catch(function (error) {

        });
    }
}

export const resetState=()=>{
    return (dispatch) => {
        dispatch({type: 'RESET_STATE'});
    }
}