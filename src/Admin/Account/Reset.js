import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import { toast } from 'react-toastify';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {Link} from 'react-router-dom';
import Form from 'react-validation/build/form';
import queryString from 'query-string';
import ErrorHandlerService from '../../Services/ErrorHandlerService';

const required = (value) => {
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <small className="error">This field is required.</small>;
    }
};

const match = (value, props, components) =>{
    if (value !== components['password'][0].value) {
        return <small className="error">Passwords are not equal.</small>
    }
};

const minlength = (value) => {
    if (value.trim().length < 6) {
        return <small className="error">Password must be at least 6 characters long</small>;
    }
};

class Reset extends Component{
    authService = new AuthenticationService();
    errorHandlerService=new ErrorHandlerService();

    constructor(props){
        super(props);
        var params = queryString.parse(this.props.location.search)
        this.state = {
            redirect: false,
            code: params.code,
            userId: params.userId,
            password: '',
            confirmPassword:'',
            isSuccess:false
        };

        this.resetPassword=this.resetPassword.bind(this);
        this.handleChangeValue=this.handleChangeValue.bind(this);
    }

    resetPassword(e){
        let thiz=this;
        e.preventDefault();
        thiz.authService.reset({code:thiz.state.code,
        userId: thiz.state.userId,
        password: thiz.state.password}).then((res)=>{
            thiz.setState({isSuccess:true});
        }).catch(function (error) {
            thiz.errorHandlerService.errorWithMessageFromAPI(error, toast);
        });;
    }

    handleChangeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }

    render(){
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        }

        if(this.state.isSuccess){
            return(<Layout>
                <div className="text-center m-b-20">
                    <p className="text-muted m-b-0">Reset password successfully. Please click the button bellow to login with the new password.  </p>
                </div>
                <Link to="/admin/login" className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3">Login</Link>
            </Layout>)
        }

        return(
            <Layout>
                <div className="text-center m-b-20">
                    <p className="text-muted m-b-0">Enter your email address and we'll send you an email with instructions to reset your password.  </p>
                </div>

                <Form className="form-horizontal" action="#">

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

                    <div className="form-group row text-center m-t-10">
                        <div className="col-12">
                            <Button onClick={this.resetPassword} className="btn btn-block btn-custom waves-effect waves-light">Reset Password</Button>
                        </div>
                    </div>

                </Form>
            </Layout>
        );
    }
}

export default Reset;