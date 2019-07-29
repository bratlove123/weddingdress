const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    supplier: {
        _id: 0,
        name: '',
        email: '',
        image: '',
        phone: '',
        address: '',
        facebook: ''
    },
    isEdit:false,
    suppliers:[],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    isLoadingSuppliers: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageSupplierReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_SUPPLIER":
            return {...state, modalIsOpen: false}
        case "GET_SUPPLIERS":
            return {
                ...state, 
                suppliers: action.suppliers.data, 
                totalItemCount: action.suppliers.countAll, 
                totalPage: action.suppliers.totalPage, 
                isLoadingSuppliers: false, 
                modalIsOpen: false,
                currentPage: action.suppliers.currentPage,
                search: action.suppliers.search,
                orderBy: action.suppliers.orderBy,
                sort: action.suppliers.sort,
                currentArrow: action.suppliers.currentArrow
            };
        case "OPEN_UPDATE_SUPPLIER_DIALOG":
            if(action.data){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1, supplier: action.data.supplier}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, supplier: {
                _id: 0,
                name: '',
                email: '',
                image: '',
                phone: '',
                address: '',
                facebook: ''
            }}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_SUPPLIER_DATA":
            return {...state, isLoadingSuppliers: true}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageSupplierReducer;