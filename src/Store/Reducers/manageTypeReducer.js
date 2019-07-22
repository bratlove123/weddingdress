const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    type: {
        _id: 0,
        name: '',
        sizes: [
            {
                name:''
            }
        ],
        del_arr: []
    },
    isEdit:false,
    types:[],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    del_arr: [],
    isLoadingTypes: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageTypeReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_TYPE":
            return {...state, modalIsOpen: false}
        case "GET_TYPES":
            return {
                ...state, 
                types: action.types.data, 
                totalItemCount: action.types.countAll, 
                totalPage: action.types.totalPage, 
                isLoadingTypes: false, 
                modalIsOpen: false,
                currentPage: action.types.currentPage,
                search: action.types.search,
                orderBy: action.types.orderBy,
                sort: action.types.sort,
                currentArrow: action.types.currentArrow
            };
        case "OPEN_UPDATE_TYPE_DIALOG":
            if(action.data){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, type: action.data.type}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, type: {
                _id: 0,
                name: '',
                sizes: [
                    {
                        name:''
                    }
                ],
                del_arr: []
            }}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_TYPE_DATA":
            return {...state, isLoadingTypes: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageTypeReducer;