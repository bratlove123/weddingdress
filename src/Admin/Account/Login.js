import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import { toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import ErrorHandlerService from '../../Services/ErrorHandlerService';

const required = (value) => {
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <small className="error">This field is required.</small>;
    }
};

class Login extends Component{
    constructor(props){
        super(props);

        let currentUrl= this.props.location && this.props.location.state && this.props.location.state.currentUrl;
        this.state = {
            username: '',
            password: '',
            email: '',
            rememberMe: false,
            redirect: false,
            redirectToConfirm: false,
            redirectUrl: currentUrl
        };

        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.setRememberMeCb=this.setRememberMeCb.bind(this);
        this.signIn=this.signIn.bind(this);
        this.handleFBLogin=this.handleFBLogin.bind(this);
    }

    handleChangeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }

    setRememberMeCb(){
        this.setState({rememberMe: !this.state.rememberMe});
    }

    signIn(e){
        e.preventDefault();
        let thiz=this;
        AuthenticationService.login({username: thiz.state.username, password: thiz.state.password}).then(res=>{
            AuthenticationService.setToken(res.data);
            thiz.setState({ redirect: true });
        }).catch(function (error) {
            ErrorHandlerService.loginErrorHandler(error, function(){
                thiz.setState({ redirectToConfirm: true });
            });
        });
    }

    loadFbLoginApi() {
        window.fbAsyncInit = function() {
            window.FB.init({
                appId      : 304707076958155,
                cookie     : true,
                xfbml      : true,
                version    : 'v2.5'
            });
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    componentDidMount(){
        this.loadFbLoginApi();
    }

    statusChangeCallback(response) {
        let thiz =this;
        if (response.status === 'connected') {
            AuthenticationService.loginFacebook({accessToken: response.authResponse.accessToken}).then((res)=>{
                AuthenticationService.setToken(res.data);
                thiz.setState({ redirect: true });
            })
            .catch(function (error) {
                ErrorHandlerService.errorWithMessageFromAPI(error);
            });
        } else if (response.status === 'not_authorized') {
            toast("Cannot login with this facebook account.", { type: toast.TYPE.ERROR });
        } else {
            toast("Unknown error with facebook login.", { type: toast.TYPE.ERROR });
        }
    }

    checkLoginState() {
        window.FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    }
  
    handleFBLogin(e) {
        e.preventDefault();
        window.FB.login(this.checkLoginState());
    }

    componentWillMount(){
        let thiz=this;
        AuthenticationService.checkLogon(AuthenticationService.getToken()).then((res)=>{
            thiz.setState({ redirect: true });
        }).catch(function (error) {
   
        });
    }

    render(){
        if (this.state.redirect) {
            if(this.state.redirectUrl){
                return <Redirect to={this.state.redirectUrl}/>;
            }
            return <Redirect to='/admin'/>;
        }
        if(this.state.redirectToConfirm){
            return <Redirect to={{
                pathname: '/admin/confirm',
                state: { email: this.state.email }
            }}/>;
        }

        return(
            <Layout>
                <Form ref={c => { this.form = c }}>

                    <div className="form-group m-b-20 row">
                        <div className="col-12">
                            <label>Username</label>
                            <Input tabIndex="1" validations={[required]} value={this.state.username} onChange={this.handleChangeValue} className="form-control" type="text" name="username" placeholder="Enter your username"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <Link to="/admin/forgot" className="text-muted pull-right"><small>Forgot your password?</small></Link>
                            <label>Password</label>
                            <Input tabIndex="2" validations={[required]} value={this.state.password} onChange={this.handleChangeValue} className="form-control" type="password" name="password" placeholder="Enter your password"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">

                            <div className="checkbox checkbox-custom">
                                <input id="remember" name="rememberMe" type="checkbox" checked={this.state.rememberMe} />
                                <label onClick={this.setRememberMeCb}>
                                    Remember me
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button className="btn btn-block btn-custom waves-effect waves-light" onClick={this.signIn}>Sign In</Button>
                        </div>
                    </div>
                    <button className="btn btn-block btn-custom waves-effect waves-light facebook-color" onClick={this.handleFBLogin}>Login with facebook</button>
                </Form>

                <div className="row m-t-50">
                    <div className="col-sm-12 text-center">
                        <p className="text-muted">Don't have an account? <Link to="/admin/registration" className="text-dark m-l-5"><b>Sign Up</b></Link></p>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Login;