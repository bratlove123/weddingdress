import { toast } from 'react-toastify';

class ErrorHandlerService{
    static errorWithMessageFromAPI(error){
        if(error && error.response && error.response.status == 400 && error.response.data){
            toast(error.response.data.Message[0], { type: toast.TYPE.ERROR });
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }

    static basicErrorHandler(error, redirectToLogin){
        if(error && error.response && error.response.status == 400 && error.response.data){
            toast(error.response.data.Message[0], { type: toast.TYPE.ERROR });
        }
        else if(error.response && error.response.status==401){
            redirectToLogin();
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }

    static loginErrorHandler(error, callback){
        if(error && error.response && error.response.status == 400 && error.response.data){
            switch(error.response.data.ErrorCode[0]){
                case "1100":
                    toast(error.response.data.Message[0], { type: toast.TYPE.ERROR });
                    break;
                case "1101":
                    let email = error.response.data.Email[0];
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