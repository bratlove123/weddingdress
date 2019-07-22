const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    color: {
        _id: 0,
        name: '',
        code: ''
    },
    isEdit:false,
    colors:[],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    isLoadingColors: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageColorReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_COLOR":
            return {...state, modalIsOpen: false}
        case "GET_COLORS":
            return {
                ...state, 
                colors: action.colors.data, 
                totalItemCount: action.colors.countAll, 
                totalPage: action.colors.totalPage, 
                isLoadingColors: false, 
                modalIsOpen: false,
                currentPage: action.colors.currentPage,
                search: action.colors.search,
                orderBy: action.colors.orderBy,
                sort: action.colors.sort,
                currentArrow: action.colors.currentArrow
            };
        case "OPEN_UPDATE_COLOR_DIALOG":
            if(action.data){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, color: action.data.color}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, color: {
                _id: 0,
                name: '',
                code: '',
            }}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_COLOR_DATA":
            return {...state, isLoadingColors: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageColorReducer;