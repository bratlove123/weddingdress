import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Link} from 'react-router-dom';
import Form from 'react-validation/build/form';
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

class Forgot extends Component{
    constructor(props){
        super(props);
        this.state = {
            redirect: false,
            email: ''
        };

        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.recoverAccount=this.recoverAccount.bind(this);
    }

    recoverAccount(e){
        let thiz=this;
        e.preventDefault();
        AuthenticationService.forgot({email:thiz.state.email}).then((res)=>{
                thiz.setState({redirect:true});
            }).catch(function (error) {
                ErrorHandlerService.errorWithMessageFromAPI(error);
            });;
    }

    handleChangeValue(e){
        this.setState({[e.target.name]: e.target.value})
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
                <div className="text-center m-b-20">
                    <p className="text-muted m-b-0">{i18n.t('ENTER_EMAIL_FORGOT')}</p>
                </div>

                <Form className="form-horizontal" action="#">

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t('EMAIL')}</label>
                            <Input name="email" validations={[required, email]} value={this.state.email} onChange={this.handleChangeValue} className="form-control" type="email" placeholder={i18n.t('ENTER_EMAIL')}/>
                        </div>
                    </div>

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button onClick={this.recoverAccount} className="btn btn-block btn-custom waves-effect waves-light">{i18n.t('RESET_PASSWORD')}</Button>
                        </div>
                    </div>

                </Form>

                <div className="row m-t-50">
                    <div className="col-sm-12 text-center">
                        <p className="text-muted">{i18n.t('BACK_TO')} <Link to="/admin/login" className="text-dark m-l-5"><b>{i18n.t('SIGN_IN')}</b></Link></p>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withNamespaces('forgot')(Forgot);