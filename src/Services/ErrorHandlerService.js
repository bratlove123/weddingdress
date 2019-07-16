import { toast } from 'react-toastify';
import AuthenticationService from './AuthenticationService';
import i18n from '../Consts/i18n';

class ErrorHandlerService{
    static errorWithMessageFromAPI(error){
        if(error && error.response && error.response.data){
            toast(error.response.data.message, { type: toast.TYPE.ERROR });
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }

    static basicErrorHandler(error, redirectToLogin){
        if(error.response && error.response.status==401){
            AuthenticationService.removeToken();
            redirectToLogin();
        }
        else{
            if(error && error.response && error.response.data){
                toast(error.response.data, { type: toast.TYPE.ERROR });
            }
        }
    }

    static loginErrorHandler(error, callback){
        if(error && error.response && error.response.data){
            switch(error.response.data.code){
                case "USER_NOT_FOUND":
                    toast(i18n.t("USER_NOT_FOUND"), { type: toast.TYPE.ERROR });
                    break;
                case "WRONG_PASSWORD":
                    toast(i18n.t("WRONG_PASSWORD"), { type: toast.TYPE.ERROR });
                    break;
                case "NOT_CONFIRM_EMAIL":
                    let email = error.response.data.email;
                    callback(email);
                    break;
            }
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }
}

export default ErrorHandlerService;