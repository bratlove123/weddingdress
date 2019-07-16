const initState={
    leftNavItems: [],
    userInfo: {
        userName: "",
        fullName: "",
        email: "",
        avatar: "",
        role: ""
    },
    redirectToLoginLeftNav:false
};

const leftNavReducer=(state=initState,action)=>{
    switch(action.type){
        case "GET_LEFTNAVS":
            return {...state, leftNavItems: action.data.leftNavItems, userInfo: action.data.userInfo};
        case "REDIRECT_TO_LOGIN_LEFT_NAV":
            return {...state, redirectToLoginLeftNav: true}
        case "RESET_STATE":
            return initState;
    }
    return state;
}

export default leftNavReducer;