import manageUserReducer from './manageUserReducer';
import appReducer from './appReducer';
import loginReducer from './loginReducer';
import leftNavReducer from './leftNavReducer';
import manageLeftNavReducer from './manageLeftNavReducer';
import manageRoleReducer from './manageRoleReducer';
import manageTypeReducer from './manageTypeReducer';
import manageColorReducer from './manageColorReducer';
import manageSupplierReducer from './manageSupplierReducer';
import manageProductReducer from './manageProductReducer';
import manageCustomerReducer from './manageCustomerReducer';
import manageCustomerGroupReducer from './manageCustomerGroupReducer';
import {combineReducers} from 'redux';

const rootReducer=combineReducers({
    manageUser: manageUserReducer,
    app: appReducer,
    login: loginReducer,
    leftNav: leftNavReducer,
    manageLeftNav: manageLeftNavReducer,
    manageRoleGroup: manageRoleReducer,
    manageType: manageTypeReducer,
    manageColor: manageColorReducer,
    manageSupplier: manageSupplierReducer,
    manageProduct: manageProductReducer,
    manageCustomer: manageCustomerReducer,
    manageCustomerGroup: manageCustomerGroupReducer
});

export default rootReducer;