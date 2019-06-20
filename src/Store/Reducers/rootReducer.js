import manageUserReducer from './manageUserReducer';
import appReducer from './appReducer';
import loginReducer from './loginReducer';
import leftNavReducer from './leftNavReducer';
import manageLeftNavReducer from './manageLeftNavReducer';
import manageRoleReducer from './manageRoleReducer';
import {combineReducers} from 'redux';

const rootReducer=combineReducers({
    manageUser: manageUserReducer,
    app: appReducer,
    login: loginReducer,
    leftNav: leftNavReducer,
    manageLeftNav: manageLeftNavReducer,
    manageRoleGroup: manageRoleReducer

});

export default rootReducer;