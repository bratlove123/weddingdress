import manageUserReducer from './manageUserReducer';
import {combineReducers} from 'redux';

const rootReducer=combineReducers({
    manageUser: manageUserReducer
});

export default rootReducer;