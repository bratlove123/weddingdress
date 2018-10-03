import React, { Component } from 'react';
import Login from './Admin/Account/Login';
import Registration from './Admin/Account/Registration';
import Dashboard from './Admin/Dashboard/Dashboard';
import ConfirmEmail from './Admin/Account/ConfirmEmail';
import VerifyEmail from './Admin/Account/VerifyEmail';
import Forgot from './Admin/Account/Forgot';
import Reset from './Admin/Account/Reset';
import FacebookAuth from './Admin/Account/FacebookAuth';
import ManageLeftNav from './Admin/ManageLeftNav/ManageLeftNav';
import {Switch, Route} from 'react-router-dom';

class Routing extends Component{
    render(){
        return(
            <div>
                <Switch>
                    <Route exact path="/admin" component={Dashboard} />
                    <Route path="/admin/login" component={Login} />
                    <Route path="/admin/registration" component={Registration} />
                    <Route path="/admin/confirm" component={ConfirmEmail} />
                    <Route path="/admin/verify" component={VerifyEmail} />
                    <Route path="/admin/forgot" component={Forgot} />
                    <Route path="/admin/reset" component={Reset} />
                    <Route path="/admin/facebookauth" component={FacebookAuth} />
                    <Route path="/admin/manageleftnav" component={ManageLeftNav} />
                </Switch>
            </div>
        );
    }
}

export default Routing;