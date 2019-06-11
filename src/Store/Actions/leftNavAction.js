import ErrorHandlerService from '../../Services/ErrorHandlerService';
import AuthenticationService from '../../Services/AuthenticationService';
import LeftNavService from '../../Services/LeftNavService';

export const getLeftNavsMenu=()=>{
    return (dispatch) => {
        LeftNavService.getLeftNavs().then((res)=>{
            if(res.data && res.data.data && res.data.data.length >0){
                let data={};
                data.leftNavItems = res.data.data;
                data.userInfo=AuthenticationService.getUserLoginInfo();
                dispatch({type: 'GET_LEFTNAVS', data});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}