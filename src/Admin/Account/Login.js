import React, {Component} from 'react';
import Layout from './Layout';
import { Redirect } from 'react-router';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {signInDispatch, loginFacebookCallbackDispatch, checkLoginStatus, resetState} from '../../Store/Actions/loginAction';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

const required = (value) => {
    if (!value.toString().trim().length) {
        return <small className="error">{i18n.t('VALIDATE_REQUIRED')}</small>;
    }
};

class Login extends Component{
    constructor(props){
        super(props);

        let currentUrl= this.props.location && this.props.location.state && this.props.location.state.currentUrl;
        this.state = {
            login: {
                username: '',
                password: '',
                rememberMe: false
            },         
            redirectUrl: currentUrl
        };

        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.setRememberMeCb=this.setRememberMeCb.bind(this);
        this.signIn=this.signIn.bind(this);
        this.handleFBLogin=this.handleFBLogin.bind(this);
    }

    handleChangeValue(e){
        this.setState({login: {...this.state.login, [e.target.name]: e.target.value}});
    }

    setRememberMeCb(){
        this.setState({login: {...this.state.login, rememberMe: !this.state.login.rememberMe}});
    }

    signIn(e){
        e.preventDefault();
        this.props.signInDispatch(this.state.login);
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

    componentWillUnmount(){
        this.props.resetState();
    }

    checkLoginState() {
        window.FB.getLoginStatus(function(response) {
            this.props.loginFacebookCallbackDispatch(response);
        }.bind(this));
    }
  
    handleFBLogin(e) {
        e.preventDefault();
        window.FB.login(this.checkLoginState());
    }

    componentWillMount(){
        this.props.checkLoginStatus();
    }

    render(){
        if(this.props.redirectToHome){
            if(this.state.redirectUrl){
                return <Redirect to={this.state.redirectUrl}/>;
            }
            else{
                return <Redirect to='/admin'/>;
            }
        }
        if(this.props.redirectToConfirm){
            return <Redirect to={{
                pathname: '/admin/confirm',
                state: { email: this.props.email }
            }}/>;
        }

        return(
            <Layout>
                <Form ref={c => { this.form = c }}>
                    <div className="form-group m-b-20 row">
                        <div className="col-12">
                            <label>{i18n.t('USER_NAME')}</label>
                            <Input validations={[required]} tabIndex="1" value={this.state.login.username} onChange={this.handleChangeValue} className="form-control" type="text" name="username" placeholder={i18n.t('ENTER_USER_NAME')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <Link to="/admin/forgot" className="text-muted pull-right"><small>{i18n.t('FORGOT_PASSWORD')}</small></Link>
                            <label>{i18n.t('PASSWORD')}</label>
                            <Input validations={[required]} tabIndex="2" value={this.state.login.password} onChange={this.handleChangeValue} className="form-control" type="password" name="password" placeholder={i18n.t('ENTER_PASSWORD')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">

                            <div className="checkbox checkbox-custom">
                                <input id="remember" name="rememberMe" type="checkbox" checked={this.state.login.rememberMe} />
                                <label onClick={this.setRememberMeCb}>
                                    {i18n.t('REMEMBER_ME')}
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button className="btn btn-block btn-custom waves-effect waves-light" onClick={this.signIn}>{i18n.t('SIGN_IN')}</Button>
                        </div>
                    </div>
                    <button className="btn btn-block btn-custom waves-effect waves-light facebook-color" onClick={this.handleFBLogin}>{i18n.t('LOGIN_FACEBOOK')}</button>
                </Form>

                <div className="row m-t-50">
                    <div className="col-sm-12 text-center">
                        <p className="text-muted">{i18n.t('NO_ACCOUNT')} <Link to="/admin/registration" className="text-dark m-l-5"><b>{i18n.t('SIGN_UP')}</b></Link></p>
                    </div>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        redirectToHome:  state.login.redirectToHome,
        redirectToConfirm:  state.login.redirectToConfirm,
        email: state.login.email
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        signInDispatch: (login) => dispatch(signInDispatch(login)),
        loginFacebookCallbackDispatch: (response) => dispatch(loginFacebookCallbackDispatch(response)),
        resetState: ()=>dispatch(resetState()),
        checkLoginStatus: ()=>dispatch(checkLoginStatus())
    }
}

export default withNamespaces('login')(connect(mapStateToProps, mapDispatchToProps)(Login));