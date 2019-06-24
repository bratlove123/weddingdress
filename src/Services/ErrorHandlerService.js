import { toast } from 'react-toastify';

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
        if(error && error.response && error.response.data){
            toast(error.response.statusText, { type: toast.TYPE.ERROR });
        }
        else if(error.response && error.response.status==401){
            redirectToLogin();
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }

    static loginErrorHandler(error, callback){
        if(error && error.response && error.response.data){
            switch(error.response.data.code){
                case "USER_NOT_FOUND":
                case "WRONG_PASSWORD":
                    toast(error.response.data.message, { type: toast.TYPE.ERROR });
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