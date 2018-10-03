import Common from '../Consts/Common';

class ErrorHandlerService{
    errorWithMessageFromAPI(error, toast){
        if(error && error.response && error.response.status == 400 && error.response.data){
            toast(error.response.data.Message[0], { type: toast.TYPE.ERROR });
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }

    basicErrorHandler(error, toast, thiz){
        if(error.response && error.response.status==401){
            if(thiz){
                thiz.setState({redirectToLogin:true});
            }
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }

    loginErrorHandler(error, toast, thiz){
        if(error && error.response && error.response.status == 400 && error.response.data){
            switch(error.response.data.ErrorCode[0]){
                case "1100":
                    toast(error.response.data.Message[0], { type: toast.TYPE.ERROR });
                    break;
                case "1101":
                    thiz.setState({redirectToConfirm:true});
                    break;
            }
        }
        else{
            toast(error.message, { type: toast.TYPE.ERROR });
        }
    }
}

export default ErrorHandlerService;