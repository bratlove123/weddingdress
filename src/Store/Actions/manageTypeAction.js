import ErrorHandlerService from '../../Services/ErrorHandlerService';
import TypeService from '../../Services/TypeService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';

export const createType=(type)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete type._id;
        delete type.del_arr;
        type.createdBy = AuthenticationService.getUserLoginInfo().id;
        type.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        TypeService.addType(type).then((res)=>{
            toast(i18n.t("ADD_TYPE_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_TYPE', type});
            dispatch(getTypes());
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const getTypes=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_TYPE_DATA'});
        let state = getState().manageType;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        TypeService.getTypesWithSorting(params).then((res)=>{
            if(res.data){
                let types = {};
                types.data = res.data.data.data;
                types.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                types.currentPage=params.pageNumber;
                types.search=params.search;
                types.orderBy=params.orderBy;
                types.sort=params.sort;
                types.currentArrow=params.currentArrow;
                types.countAll=res.data.data.countAll;
                dispatch({type: 'GET_TYPES', types});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateTypeDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            TypeService.getType(id).then((res)=>{
                if(res.data){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    let data = {};
                    data.type = res.data.data;
                    dispatch({type: 'OPEN_UPDATE_TYPE_DIALOG', data});
                }
            }).catch(function (error) {
                ErrorHandlerService.basicErrorHandler(error, function(){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    ErrorHandlerService.basicErrorHandler(error, function(){
                        dispatch({type: 'REDIRECT_TO_LOGIN'});
                    });
                });
            });
        }
        else{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            dispatch({type: 'OPEN_UPDATE_TYPE_DIALOG'});
        }
    }
}

export const updateTypeDispatch=(type)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        type.modifiedOn =  new Date();
        type.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        TypeService.editType(type._id, type).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("UPDATE_TYPE_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_TYPE', type});
            dispatch(getTypes());
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const deleteTypeDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        TypeService.deleteType(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_TYPE_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getTypes(1));
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