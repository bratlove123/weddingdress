import ErrorHandlerService from '../../Services/ErrorHandlerService';
import AuthenticationService from '../../Services/AuthenticationService';
import { toast } from 'react-toastify';

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
            toast("Cannot login with this facebook account.", { type: toast.TYPE.ERROR });
        } else {
            toast("Unknown error with facebook login.", { type: toast.TYPE.ERROR });
        }
    }
}

export const resetState=()=>{
    return (dispatch) => {
        dispatch({type: 'RESET_STATE'});
    }
}