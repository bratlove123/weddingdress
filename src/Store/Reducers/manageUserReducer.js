const initState={
    users:[],
    isLoadingUsers: true,
    modalIsOpen: false,
    modalPermissionIsOpen: false,
    fixOpenPermission: false,
    isEdit: false,
    fixOpen: 1,
    redirectToLogin: false,
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1,
    user: {
        image: null,
        userName: "",
        password: "",
        repassword: "",
        email: "",
        firstName: "",
        lastName: "",
        role: ""
    },
    rolesOfUser: [],
    allRoles: [],
    roleId: null
};

const manageUserReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_USER":
            return {...state, modalIsOpen: false, modalPermissionIsOpen: false}
        case "GET_USERS":
            return {
                ...state, 
                users: action.users.data, 
                totalItemCount: action.users.countAll, 
                totalPage: action.users.totalPage, 
                isLoadingUsers: false, 
                currentPage: action.users.currentPage,
                search: action.users.search,
                orderBy: action.users.orderBy,
                sort: action.users.sort,
                currentArrow: action.users.currentArrow
            };
        case "OPEN_UPDATE_USER_DIALOG":
            if(action.res){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, user: action.res.user}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, roles: action.roles, user: {
                image: null,
                userName: "",
                password: "",
                repassword: "",
                email: "",
                firstName: "",
                lastName: "",
                role: ""
            }}
        case "OPEN_UPDATE_PERMISSION_DIALOG":
            if(action.res){
                return {...state, modalPermissionIsOpen: true, fixOpenPermission: state.fixOpenPermission + 1, rolesOfUser: action.res.rolesOfUser, allRoles: action.res.allRoles, roleId: action.res.id}
            }
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_USER_DATA":
            return {...state, isLoadingUsers: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageUserReducer;