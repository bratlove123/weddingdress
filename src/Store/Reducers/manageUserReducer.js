const initState={
    users:[],
    isLoadingUsers: true,
    modalIsOpen: false,
    isEdit: false,
    fixOpen: 1,
    redirectToLogin: false
};

const manageUserReducer=(state=initState,action)=>{
    switch(action.type){
        case "CREATE_USER":
            return {...state, modalIsOpen: false}
        case "GET_USERS":
            return {...state, users: action.users, isLoadingUsers: false};
        case "OPEN_UPDATE_USER_DIALOG":
            if(action.id){
                return {...state, modalIsOpen: true, isEdit: true, fixOpen: state.fixOpen + 1}
            }
            return {...state, modalIsOpen: true, isEdit: false, fixOpen: state.fixOpen + 1}
        case "REDIRECT_TO_LOGIN":
            return {...state, redirectToLogin: true}
    }
    return state;
}

export default manageUserReducer;