const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    customerGroup: {
        _id: 0,
        title: '',
        level: '',
        targetPoint: '',
        minMoney: '',
        discount: '',
        description: '',
        image: ''
    },
    isEdit:false,
    customerGroups:[],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    isLoadingCustomerGroups: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageCustomerGroupReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_CUSTOMER_GROUP":
            return {...state, modalIsOpen: false}
        case "GET_CUSTOMER_GROUPS":
            return {
                ...state, 
                customerGroups: action.customerGroups.data, 
                totalItemCount: action.customerGroups.countAll, 
                totalPage: action.customerGroups.totalPage, 
                isLoadingCustomerGroups: false, 
                modalIsOpen: false,
                currentPage: action.customerGroups.currentPage,
                search: action.customerGroups.search,
                orderBy: action.customerGroups.orderBy,
                sort: action.customerGroups.sort,
                currentArrow: action.customerGroups.currentArrow
            };
        case "OPEN_UPDATE_CUSTOMER_GROUP_DIALOG":
            if(action.data){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, customerGroup: action.data.customerGroup}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, customerGroup: {
                _id: 0,
                title: '',
                level: '',
                targetPoint: '',
                minMoney: '',
                discount: '',
                description: '',
                image: ''
            }}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_CUSTOMER_GROUP_DATA":
            return {...state, isLoadingCustomerGroups: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageCustomerGroupReducer;