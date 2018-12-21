const initState={
    redirectToHome: false,
    redirectToConfirm: false,
    email: ""
};

const loginReducer=(state=initState,action)=>{
    switch(action.type){
        case "REDIRECT_TO_HOME":
            return {...state, redirectToHome: action.redirectToHome}
        case "REDIRECT_TO_CONFIRM":
            return {...state, redirectToConfirm: action.res.redirectToConfirm, email: action.res.email}
        case "RESET_STATE":
            return initState;
    }
    return state;
}

export default loginReducer;