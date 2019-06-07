import React from 'react';  
import { Redirect, Route } from 'react-router-dom';

// Utils
import AuthenticationService from '../Services/AuthenticationService';

const LoginRoute = ({ component: Component, ...rest }) =>{
    return (  
        <Route {...rest} render={props => (
          AuthenticationService.getToken() === null ? (
            <Component {...props} />
          ) : (
            <Redirect to={{
              pathname: '/admin'
          }} />
          )
        )} />
      );      
} 
export default LoginRoute;