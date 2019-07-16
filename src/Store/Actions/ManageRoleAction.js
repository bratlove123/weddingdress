import ErrorHandlerService from '../../Services/ErrorHandlerService';
import RoleService from '../../Services/RoleService';
import { toast } from 'react-toastify';
import Common from '../../Consts/Common';
import AuthenticationService from '../../Services/AuthenticationService';
import i18n from '../../Consts/i18n';

export const createRoleGroup=(roleGroup)=>{
    return (dispatch) => {
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        delete roleGroup._id;
        delete roleGroup.del_arr;
        roleGroup.createdBy = AuthenticationService.getUserLoginInfo().id;
        roleGroup.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        RoleService.addRoleGroup(roleGroup).then((res)=>{
            toast(i18n.t("ADD_ROLE_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_ROLE_GROUP', roleGroup});
            dispatch(getRoleGroups());
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

export const getRoleGroups=(page, search, orderBy, sort, currentArrow)=>{
    return (dispatch, getState) => {
        dispatch({type: 'SHOW_LOADING_ROLE_GROUP_DATA'});
        let state = getState().manageRoleGroup;
        let params = {
            pageSize: Common.pageSize,
            pageNumber: page!==undefined?page:state.currentPage,
            orderBy: orderBy!==undefined?orderBy:state.orderBy,
            sort: sort!==undefined?sort:state.sort,
            search: search!==undefined?search:state.search,
            currentArrow: currentArrow!==undefined?currentArrow:state.currentArrow
        };
        RoleService.getRoleGroupsWithSorting(params).then((res)=>{
            if(res.data){
                let roleGroups = {};
                roleGroups.data = res.data.data.data;
                roleGroups.totalPage=Math.ceil(res.data.data.countAll/Common.pageSize);
                roleGroups.currentPage=params.pageNumber;
                roleGroups.search=params.search;
                roleGroups.orderBy=params.orderBy;
                roleGroups.sort=params.sort;
                roleGroups.currentArrow=params.currentArrow;
                roleGroups.countAll=res.data.data.countAll;
                dispatch({type: 'GET_ROLE_GROUPS', roleGroups});
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const openUpdateRoleGroupDialog=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        if(id){
            RoleService.getRoleGroup(id).then((res)=>{
                if(res.data){
                    let isShow = false;
                    dispatch({type: 'TOOGLE_LOADING', isShow});
                    let data = {};
                    data.roleGroup = res.data.data;
                    dispatch({type: 'OPEN_UPDATE_ROLE_GROUP_DIALOG', data});
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
            dispatch({type: 'OPEN_UPDATE_ROLE_GROUP_DIALOG'});
        }
    }
}

export const updateRoleGroupDispatch=(roleGroup)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        roleGroup.modifiedOn =  new Date();
        roleGroup.modifiedBy = AuthenticationService.getUserLoginInfo().id;
        RoleService.editRoleGroup(roleGroup._id, roleGroup).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("UPDATE_ROLE_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch({type: 'UPDATE_ROLE_GROUP', roleGroup});
            dispatch(getRoleGroups());
        }).catch(function (error) {
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            ErrorHandlerService.basicErrorHandler(error, function(){
                dispatch({type: 'REDIRECT_TO_LOGIN'});
            });
        });
    }
}

export const deleteRoleGroupDispatch=(id)=>{
    return (dispatch) =>{
        let isShow = true;
        dispatch({type: 'TOOGLE_LOADING', isShow});
        RoleService.deleteRoleGroup(id).then((res)=>{
            let isShow = false;
            dispatch({type: 'TOOGLE_LOADING', isShow});
            toast(i18n.t("DELETE_ROLE_SUCCESS"), { type: toast.TYPE.SUCCESS });
            dispatch(getRoleGroups(1));
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