import React from 'react';  
import { Redirect, Route } from 'react-router-dom';

// Utils
import AuthenticationService from '../Services/AuthenticationService';

//const authService = new AuthenticationService();
const PrivateRoute = ({ component: Component, ...rest }) =>{
    return (  
        <Route {...rest} render={props => (
          AuthenticationService.getToken() !== null ? (
            <Component {...props} />
          ) : (
            <Redirect to={{
              pathname: '/admin/login',
              state: { currentUrl: window.location.pathname }
          }} />
          )
        )} />
      );      
} 
export default PrivateRoute;