const initState={
    leftNavItems: [],
    userInfo: {
        userName: "",
        fullName: "",
        email: "",
        avatar: "",
        role: ""
    },
    redirectToLogin:false
};

const leftNavReducer=(state=initState,action)=>{
    switch(action.type){
        case "GET_LEFTNAVS":
            return {...state, leftNavItems: action.data.leftNavItems, userInfo: action.data.userInfo}
    }
    return state;
}

export default leftNavReducer;