import manageUserReducer from './manageUserReducer';
import appReducer from './appReducer';
import loginReducer from './loginReducer';
import leftNavReducer from './leftNavReducer';
import manageLeftNavReducer from './manageLeftNavReducer';
import manageRoleReducer from './manageRoleReducer';
import manageTypeReducer from './manageTypeReducer';
import manageColorReducer from './manageColorReducer';
import {combineReducers} from 'redux';

const rootReducer=combineReducers({
    manageUser: manageUserReducer,
    app: appReducer,
    login: loginReducer,
    leftNav: leftNavReducer,
    manageLeftNav: manageLeftNavReducer,
    manageRoleGroup: manageRoleReducer,
    manageType: manageTypeReducer,
    manageColor: manageColorReducer
});

export default rootReducer;