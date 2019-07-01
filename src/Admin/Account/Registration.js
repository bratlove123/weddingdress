import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Link} from 'react-router-dom';
import ErrorHandlerService from '../../Services/ErrorHandlerService';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

const required = (value) => {
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <small className="error">{i18n.t('VALIDATE_REQUIRED')}</small>;
    }
};

const email = (value) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(value.toLowerCase())) {
        return <small className="error">{i18n.t('VALIDATE_EMAIL')}</small>;
    }
};

const minlength = (value) => {
    if (value.trim().length < 6) {
        return <small className="error">{i18n.t('VALIDATE_PASSWORD')}</small>;
    }
};

const match = (value, props, components) =>{
    if (value !== components['password'][0].value) {
        return <small className="error">{i18n.t('VALIDATE_MATCH_PASSWORD')}</small>
    }
};

class Registration extends Component{
    constructor(props){
        super(props);

        this.state = {
            username: '',
            email: '',
            firstname:'',
            lastname: '',
            password: '',
            confirmPassword:'',
            rememberMe: false,
            redirect: false
        };

        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.setRememberMeCb=this.setRememberMeCb.bind(this);
        this.signUp=this.signUp.bind(this);
    }

    handleChangeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }

    setRememberMeCb(){
        this.setState({rememberMe: !this.state.rememberMe});
    }

    signUp(e){
        let thiz=this;
        e.preventDefault();
        AuthenticationService.signup({
            userName: thiz.state.username,
            email: thiz.state.email,
            password: thiz.state.password,
            firstName: thiz.state.firstname,
            lastName:thiz.state.lastname
        }).then(res=>{
            AuthenticationService.setToken(res.data);
            thiz.setState({ redirect: true });
        }).catch(function (error) {
            ErrorHandlerService.errorWithMessageFromAPI(error);
        });
    }

    render(){
        if (this.state.redirect) {
            return <Redirect to={{
                pathname: '/admin/confirm',
                state: { email: this.state.email }
            }}/>;
        }

        return(
            <Layout>
                <Form className="form-horizontal" action="#">

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('USER_NAME')}<span className="text-danger">*</span></label>
                            <Input validations={[required, minlength]} value={this.state.username} onChange={this.handleChangeValue} className="form-control" type="text" name="username" placeholder={i18n.t('ENTER_USER_NAME')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('EMAIL')}<span className="text-danger">*</span></label>
                            <Input validations={[required, email]} value={this.state.email} onChange={this.handleChangeValue} className="form-control" type="email" name="email" placeholder={i18n.t('ENTER_EMAIL')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('FIRST_NAME')}<span className="text-danger">*</span></label>
                            <Input validations={[required]} value={this.state.firstname} onChange={this.handleChangeValue} className="form-control" type="text" name="firstname" placeholder={i18n.t('ENTER_FIRST_NAME')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('LAST_NAME')}<span className="text-danger">*</span></label>
                            <Input validations={[required]} value={this.state.lastname} onChange={this.handleChangeValue} className="form-control" type="text" name="lastname" placeholder={i18n.t('ENTER_LAST_NAME')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('PASSWORD')}<span className="text-danger">*</span></label>
                            <Input validations={[required, minlength]} value={this.state.password} onChange={this.handleChangeValue} className="form-control" type="password" name="password" placeholder={i18n.t('ENTER_PASSWORD')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('CONFIRM_PASSWORD')}<span className="text-danger">*</span></label>
                            <Input validations={[required, match]} value={this.state.confirmPassword} onChange={this.handleChangeValue} className="form-control" type="password" name="confirmPassword" placeholder={i18n.t('ENTER_CONFIRM_PASSWORD')}/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">

                            <div className="checkbox checkbox-custom">
                                <input checked={this.state.rememberMe} name="rememberMe" type="checkbox"/>
                                <label onClick={this.setRememberMeCb}>
                                    {i18n.t('ACCEPT')}<a href='#' className='text-custom'>{i18n.t('TERMS')}</a>
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button onClick={this.signUp} className="btn btn-block btn-custom waves-effect waves-light">{i18n.t('SIGN_UP')}</Button>
                        </div>
                    </div>

                </Form>

                <div className="row m-t-50">
                    <div className="col-sm-12 text-center">
                        <p className="text-muted">{i18n.t('ALREADY_HAVE_ACC')}  <Link to="/admin/login"  className="text-dark m-l-5"><b>{i18n.t('SIGN_IN')}</b></Link></p>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withNamespaces('registration')(Registration);