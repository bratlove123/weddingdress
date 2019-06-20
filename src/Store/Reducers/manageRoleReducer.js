const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    roleGroup: {
        _id: 0,
        name: '',
        code: '',
        childs: [
            {
                name:'',
                code: ''
            }
        ],
        del_arr: []
    },
    isEdit:false,
    roleGroups:[],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    del_arr: [],
    isLoadingRoleGroups: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageRoleGroupReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_ROLE_GROUP":
            return {...state, modalIsOpen: false}
        case "GET_ROLE_GROUPS":
            return {
                ...state, 
                roleGroups: action.roleGroups.data, 
                totalItemCount: action.roleGroups.countAll, 
                totalPage: action.roleGroups.totalPage, 
                isLoadingRoleGroups: false, 
                currentPage: action.roleGroups.currentPage,
                search: action.roleGroups.search,
                orderBy: action.roleGroups.orderBy,
                sort: action.roleGroups.sort,
                currentArrow: action.roleGroups.currentArrow
            };
        case "OPEN_UPDATE_ROLE_GROUP_DIALOG":
            if(action.data){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, roleGroup: action.data.roleGroup}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, roleGroup: {
                _id: 0,
                name: '',
                code: '',
                childs: [
                    {
                        name:'',
                        code: ''
                    }
                ],
                del_arr: []
            }}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_ROLE_GROUP_DATA":
            return {...state, isLoadingRoleGroups: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageRoleGroupReducer;