import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import { toast } from 'react-toastify';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Link} from 'react-router-dom';
import Form from 'react-validation/build/form';
import ErrorHandlerService from '../../Services/ErrorHandlerService';

const required = (value) => {
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <small className="error">This field is required.</small>;
    }
};

const email = (value) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(value.toLowerCase())) {
        return <small className="error">Invalid email format</small>;
    }
};

class Forgot extends Component{
    authService = new AuthenticationService();
    errorHandlerService=new ErrorHandlerService();
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
        thiz.authService.forgot({email:thiz.state.email}).then((res)=>{
                thiz.setState({redirect:true});
            }).catch(function (error) {
                thiz.errorHandlerService.errorWithMessageFromAPI(error, toast);
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
                    <p className="text-muted m-b-0">Enter your email address and we'll send you an email with instructions to reset your password.  </p>
                </div>

                <Form className="form-horizontal" action="#">

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>Email address</label>
                            <Input name="email" validations={[required, email]} value={this.state.email} onChange={this.handleChangeValue} className="form-control" type="email" placeholder="john@deo.com"/>
                        </div>
                    </div>

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button onClick={this.recoverAccount} className="btn btn-block btn-custom waves-effect waves-light">Reset Password</Button>
                        </div>
                    </div>

                </Form>

                <div className="row m-t-50">
                    <div className="col-sm-12 text-center">
                        <p className="text-muted">Back to <Link to="/admin/login" className="text-dark m-l-5"><b>Sign In</b></Link></p>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Forgot;