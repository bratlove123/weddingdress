const initState={
    isShowGlobalLoading: false
};

const appReducer=(state=initState,action)=>{
    switch(action.type){
        case "TOOGLE_LOADING":
            return {...state, isShowGlobalLoading: action.isShow}
    }
    return state;
}

export default appReducer;