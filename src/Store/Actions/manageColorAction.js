import ErrorHandlerService from '../../Services/ErrorHandlerService';
import ColorService from '../../Services/ColorService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';

export const createColor=(color)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete color._id;
        color.createdBy = AuthenticationService.getUserLoginInfo().id;
        color.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        ColorService.addColor(color).then((res)=>{
            toast(i18n.t("ADD_COLOR_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_COLOR', color});
            dispatch(getColors());
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

export const getColors=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_COLOR_DATA'});
        let state = getState().manageColor;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        ColorService.getColorsWithSorting(params).then((res)=>{
            if(res.data){
                let colors = {};
                colors.data = res.data.data.data;
                colors.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                colors.currentPage=params.pageNumber;
                colors.search=params.search;
                colors.orderBy=params.orderBy;
                colors.sort=params.sort;
                colors.currentArrow=params.currentArrow;
                colors.countAll=res.data.data.countAll;
                dispatch({type: 'GET_COLORS', colors});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateColorDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            ColorService.getColor(id).then((res)=>{
                if(res.data){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    let data = {};
                    data.color = res.data.data;
                    dispatch({type: 'OPEN_UPDATE_COLOR_DIALOG', data});
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
            dispatch({type: 'OPEN_UPDATE_COLOR_DIALOG'});
        }
    }
}

export const updateColorDispatch=(color)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        color.modifiedOn =  new Date();
        color.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        ColorService.editColor(color._id, color).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("UPDATE_COLOR_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_COLOR', color});
            dispatch(getColors());
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const deleteColorDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        ColorService.deleteColor(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_COLOR_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getColors(1));
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