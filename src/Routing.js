import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import PrivateRoute from './Common/PrivateRoute';
import LoginRoute from './Common/LoginRoute';
import asyncComponent from './Common/AsyncComponent';

const Login = asyncComponent(() =>
  import('./Admin/Account/Login').then(module => module.default)
)
const Registration = asyncComponent(() =>
  import('./Admin/Account/Registration').then(module => module.default)
)
const Dashboard = asyncComponent(() =>
  import('./Admin/Dashboard/Dashboard').then(module => module.default)
)
const ConfirmEmail = asyncComponent(() =>
  import('./Admin/Account/ConfirmEmail').then(module => module.default)
)
const VerifyEmail = asyncComponent(() =>
  import('./Admin/Account/VerifyEmail').then(module => module.default)
)
const Forgot = asyncComponent(() =>
  import('./Admin/Account/Forgot').then(module => module.default)
)
const Reset = asyncComponent(() =>
  import('./Admin/Account/Reset').then(module => module.default)
)
const FacebookAuth = asyncComponent(() =>
  import('./Admin/Account/FacebookAuth').then(module => module.default)
)
const ManageLeftNav = asyncComponent(() =>
  import('./Admin/ManageLeftNav/ManageLeftNav').then(module => module.default)
)
const ManageUser = asyncComponent(() =>
  import('./Admin/ManageUser/ManageUser').then(module => module.default)
)
const ManageRole = asyncComponent(() =>
  import('./Admin/ManageRole/ManageRole').then(module => module.default)
)
const ManageType = asyncComponent(() =>
  import('./Admin/ManageType/ManageType').then(module => module.default)
)
const ManageColor = asyncComponent(() =>
  import('./Admin/ManageColor/ManageColor').then(module => module.default)
)
const ManageSupplier = asyncComponent(() =>
  import('./Admin/ManageSupplier/ManageSupplier').then(module => module.default)
)
const ManageProduct = asyncComponent(() =>
  import('./Admin/ManageProduct/ManageProduct').then(module => module.default)
)
const ManageCustomerGroup = asyncComponent(() =>
  import('./Admin/ManageCustomerGroup/ManageCustomerGroup').then(module => module.default)
)
const ManageCustomer = asyncComponent(() =>
  import('./Admin/ManageCustomer/ManageCustomer').then(module => module.default)
)
const PageNotFound = asyncComponent(() =>
  import('./Admin/Account/PageNotFound').then(module => module.default)
)

class Routing extends Component{
    render(){
        return(
            <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/admin" component={Dashboard} />
                <LoginRoute path="/admin/login" component={Login} />
                <Route path="/admin/registration" component={Registration} />
                <Route path="/admin/confirm" component={ConfirmEmail} />
                <Route path="/admin/verify" component={VerifyEmail} />
                <Route path="/admin/forgot" component={Forgot} />
                <Route path="/admin/reset" component={Reset} />
                <Route path="/admin/facebookauth" component={FacebookAuth} />
                <PrivateRoute path="/admin/manageleftnav" component={ManageLeftNav} />
                <PrivateRoute path="/admin/manageuser" component={ManageUser} />
                <PrivateRoute path="/admin/managerole" component={ManageRole} />
                <PrivateRoute path="/admin/managetype" component={ManageType} />
                <PrivateRoute path="/admin/managecolor" component={ManageColor} />
                <PrivateRoute path="/admin/managesupplier" component={ManageSupplier} />
                <PrivateRoute path="/admin/manageproduct" component={ManageProduct} />
                <PrivateRoute path="/admin/managecustomergroup" component={ManageCustomerGroup} />
                <PrivateRoute path="/admin/managecustomer" component={ManageCustomer} />
                <PrivateRoute component={PageNotFound} />
            </Switch>
        );
    }
}

export default Routing;