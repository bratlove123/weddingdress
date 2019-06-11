const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    leftNav: {
        _id: 0,
        name: '',
        url: '',
        iconClass: '',
        isHasBadge: false,
        badgeClass: '',
        badgeNumber: 0,
        position:0,
        childs: [
            {
                name:'',
                url: '',
                position: 0
            }
        ],
        del_arr: []
    },
    isEdit:false,
    leftNavs:[],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    del_arr: [],
    isLoadingLeftNavs: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageLeftNavReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_LEFT_NAV":
            return {...state, modalIsOpen: false}
        case "GET_LEFT_NAVS":
            return {
                ...state, 
                leftNavs: action.leftNavs.data, 
                totalItemCount: action.leftNavs.countAll, 
                totalPage: action.leftNavs.totalPage, 
                isLoadingLeftNavs: false, 
                currentPage: action.leftNavs.currentPage,
                search: action.leftNavs.search,
                orderBy: action.leftNavs.orderBy,
                sort: action.leftNavs.sort,
                currentArrow: action.leftNavs.currentArrow
            };
        case "OPEN_UPDATE_LEFT_NAV_DIALOG":
            if(action.data){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, leftNav: action.data.leftNav}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, leftNav: {
                _id: 0,
                name: '',
                url: '',
                iconClass: '',
                isHasBadge: false,
                badgeClass: '',
                badgeNumber: 0,
                childs: [
                    {
                        name:'',
                        url: '',
                        position: 0
                    }
                ],
                position: 0,
                del_arr: []
            }}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_LEFT_NAV_DATA":
            return {...state, isLoadingLeftNavs: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageLeftNavReducer;