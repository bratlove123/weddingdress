const initState={
    users:[

    ],
    modalIsOpen: false
};

const manageUserReducer=(state=initState,action)=>{
    switch(action.type){
        case "CREATE_USER":
            console.log('created user', action.user);
            break;
    }
    return state;
}

export default manageUserReducer;