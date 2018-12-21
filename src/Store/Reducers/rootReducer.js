import manageUserReducer from './manageUserReducer';
import appReducer from './appReducer';
import loginReducer from './loginReducer';
import leftNavReducer from './leftNavReducer';
import {combineReducers} from 'redux';

const rootReducer=combineReducers({
    manageUser: manageUserReducer,
    app: appReducer,
    login: loginReducer,
    leftNav: leftNavReducer
});

export default rootReducer;