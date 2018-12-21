export const toggleGlobalLoading=(isShow)=>{
    return (dispatch) =>{
        dispatch({type: 'TOOGLE_LOADING', isShow});
    }
}