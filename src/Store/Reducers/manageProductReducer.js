const initState={
    modalIsOpen: false,
    redirectToLogin:false,
    product: {
        _id: 0,
        name: '',
        code: '',
        des: '',
        lookAfter: '',
        brand: '',
        supplierId: '',
        typeId:'',
        details: [
            {
                colorId: '',
                sizes: [
                    {
                        sizeId:'',
                        quantity:''
                    }
                ],
                images: [],
                imgSrcs: [],
                price: '',
                ogPrice:'',
                whPrice: ''
            }
        ],
        del_arr: [],
        del_size_arr: []
    },
    isEdit:false,
    products:[],
    colors: [],
    types: [],
    sizes: [],
    suppliers: [],
    currentPage: 1,
    totalPage: 0,
    totalItemCount: 0,
    isLoadingProducts: true,
    fixOpen: 1,
    orderBy: "",
    sort: false,
    search: "",
    currentArrow: -1
};

const manageProductReducer=(state=initState,action)=>{
    switch(action.type){
        case "UPDATE_PRODUCT":
            return {...state, modalIsOpen: false}
        case "GET_PRODUCTS":
            return {
                ...state, 
                products: action.products.data, 
                totalItemCount: action.products.countAll, 
                totalPage: action.products.totalPage, 
                isLoadingProducts: false, 
                currentPage: action.products.currentPage,
                search: action.products.search,
                orderBy: action.products.orderBy,
                sort: action.products.sort,
                currentArrow: action.products.currentArrow
            };
        case "OPEN_UPDATE_PRODUCT_DIALOG":
            if(action.data.isEdit){
                return {...state, 
                    modalIsOpen: true, 
                    isEdit: true, 
                    fixOpen: state.fixOpen + 1, 
                    product: action.data.product,
                    colors: action.data.colors,
                    suppliers: action.data.suppliers,
                    types: action.data.types
                }
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1, product: {
                _id: 0,
                name: '',
                code: '',
                des: '',
                lookAfter: '',
                brand: '',
                supplierId: '',
                typeId:'',
                details: [
                    {
                        colorId:'',
                        sizes: [
                            {
                                sizeId:'',
                                quantity:''
                            }
                        ],
                        images: [],
                        imgSrcs: [],
                        price: '',
                        ogPrice: '',
                        whPrice: ''
                    }
                ],
                del_arr: [],
                del_size_arr: []
            },
            colors: action.data.colors,
            suppliers: action.data.suppliers,
            types: action.data.types
        }
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
        case "SHOW_LOADING_PRODUCT_DATA":
            return {...state, isLoadingProducts: true}
        case "GET_TYPE_BY_ID":
            return {...state, sizes: action.typeData.sizes, product: action.typeData.product}
        case "RESET_STATE":
            return initState;
        default:
            break;
    }
    return state;
}

export default manageProductReducer;