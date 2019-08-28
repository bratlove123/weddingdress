const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    customer: {
        _id: 0,
        name: '',
        email: '',
        birthday: '',
        sex: '',
        address: '',
        phone: '',
        facebook: '',
        image: '',
        point: '',
        customerGroupId: ''
    },
    isEdit:false,
    customers:[],
    customerGroups: [],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    isLoadingCustomers: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageCustomerReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_CUSTOMER":
            return {...state, modalIsOpen: false}
        case "GET_CUSTOMERS":
            return {
                ...state, 
                customers: action.customers.data, 
                totalItemCount: action.customers.countAll, 
                totalPage: action.customers.totalPage, 
                isLoadingCustomers: false, 
                modalIsOpen: false,
                currentPage: action.customers.currentPage,
                search: action.customers.search,
                orderBy: action.customers.orderBy,
                sort: action.customers.sort,
                currentArrow: action.customers.currentArrow
            };
        case "OPEN_UPDATE_CUSTOMER_DIALOG":
            if(action.data.isEdit){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, customer: action.data.customer, customerGroups: action.data.customerGroups}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, customer: {
                _id: 0,
                name: '',
                email: '',
                birthday: '',
                sex: '',
                address: '',
                phone: '',
                facebook: '',
                image: '',
                point: '',
                customerGroupId: ''
            }, customerGroups: action.data.customerGroups}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_CUSTOMER_DATA":
            return {...state, isLoadingCustomers: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageCustomerReducer;