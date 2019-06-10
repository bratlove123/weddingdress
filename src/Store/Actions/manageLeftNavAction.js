import ErrorHandlerService from '../../Services/ErrorHandlerService';
import LeftNavService from '../../Services/LeftNavService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';

export const createLeftNav=(leftNav)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        LeftNavService.addLeftNav(leftNav).then((res)=>{
            toast("Added left nav item successfully.", { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_LEFT_NAV', leftNav});
            dispatch(getLeftNavs());
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const getLeftNavs=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_LEFT_NAV_DATA'});
        let state = getState().manageLeftNav;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        LeftNavService.getLeftNavsWithSorting(params).then((res)=>{
            if(res.data){
                let leftNavs = {};
                leftNavs.data = res.data.data.data;
                leftNavs.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                leftNavs.currentPage=params.pageNumber;
                leftNavs.search=params.search;
                leftNavs.orderBy=params.orderBy;
                leftNavs.sort=params.sort;
                leftNavs.currentArrow=params.currentArrow;
                leftNavs.countAll=res.data.data.countAll;
                dispatch({type: 'GET_LEFT_NAVS', leftNavs});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateLeftNavDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            LeftNavService.getLeftNav(id).then((res)=>{
                if(res.data){
                    let data = {};
                    data.leftNav = res.data.data;
                    dispatch({type: 'OPEN_UPDATE_LEFT_NAV_DIALOG', data});
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
            dispatch({type: 'OPEN_UPDATE_LEFT_NAV_DIALOG'});
        }
    }
}

export const updateLeftNavDispatch=(leftNav)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        LeftNavService.editLeftNav(leftNav.id, leftNav).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast("Updated left nav successfully.", { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_LEFT_NAV', leftNav});
            dispatch(getLeftNavs());
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const deleteLeftNavDispatch=(id)=>{
    return (dispatch) =>{
    }
}

export const resetState=()=>{
    return (dispatch)=>{
        dispatch({type: 'RESET_STATE'});
    }
}