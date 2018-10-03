import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import { ToastContainer, toast } from 'react-toastify';
import {Link} from 'react-router-dom';
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

const minlength = (value) => {
    if (value.trim().length < 6) {
        return <small className="error">Password must be at least 6 characters long</small>;
    }
};

const match = (value, props, components) =>{
    if (value !== components['password'][0].value) {
        return <small className="error">Passwords are not equal.</small>
    }
};

class Registration extends Component{

    authService = new AuthenticationService();
    errorHandlerService=new ErrorHandlerService();

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
        thiz.authService.signup({
            username: thiz.state.username,
            email: thiz.state.email,
            password: thiz.state.password,
            firstName: thiz.state.firstname,
            lastName:thiz.state.lastname
        }).then(res=>{
            thiz.authService.setToken(res.data);
            thiz.setState({ redirect: true });
        }).catch(function (error) {
            thiz.errorHandlerService.errorWithMessageFromAPI(error, toast);
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
                <ToastContainer />
                <Form className="form-horizontal" action="#">

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>Username<span className="text-danger">*</span></label>
                            <Input validations={[required, minlength]} value={this.state.username} onChange={this.handleChangeValue} className="form-control" type="text" name="username" placeholder="johndoe"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>Email address<span className="text-danger">*</span></label>
                            <Input validations={[required, email]} value={this.state.email} onChange={this.handleChangeValue} className="form-control" type="email" name="email" placeholder="john@deo.com"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>First Name<span className="text-danger">*</span></label>
                            <Input validations={[required]} value={this.state.firstname} onChange={this.handleChangeValue} className="form-control" type="text" name="firstname" placeholder="John"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>Last Name<span className="text-danger">*</span></label>
                            <Input validations={[required]} value={this.state.lastname} onChange={this.handleChangeValue} className="form-control" type="text" name="lastname" placeholder="Doe"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>Password<span className="text-danger">*</span></label>
                            <Input validations={[required, minlength]} value={this.state.password} onChange={this.handleChangeValue} className="form-control" type="password" name="password" placeholder="Enter your password"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>Confirm Password<span className="text-danger">*</span></label>
                            <Input validations={[required, match]} value={this.state.confirmPassword} onChange={this.handleChangeValue} className="form-control" type="password" name="confirmPassword" placeholder="Repeat your password"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">

                            <div className="checkbox checkbox-custom">
                                <input checked={this.state.rememberMe} name="rememberMe" type="checkbox"/>
                                <label onClick={this.setRememberMeCb}>
                                    I accept <a href="#" className="text-custom">Terms and Conditions</a>
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button onClick={this.signUp} className="btn btn-block btn-custom waves-effect waves-light">Sign Up Free</Button>
                        </div>
                    </div>

                </Form>

                <div className="row m-t-50">
                    <div className="col-sm-12 text-center">
                        <p className="text-muted">Already have an account?  <Link to="/admin/login"  className="text-dark m-l-5"><b>Sign In</b></Link></p>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Registration;