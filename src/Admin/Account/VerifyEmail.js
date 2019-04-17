import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import queryString from 'query-string';
import ErrorHandlerService from '../../Services/ErrorHandlerService';

class VerifyEmail extends Component{
    constructor(props){
        super(props);
        var params = queryString.parse(this.props.location.search)
        this.state = {
            redirect: false,
            code: params.code,
            email: params.email,
            message: "Verify email failure! Please click the link below to resend the email.",
            isSuccess: false,
            redirectToLogin:false,
            redirectToConfirm:false
        };
        this.btnSumitClick=this.btnSumitClick.bind(this);
    }

    componentWillMount(){
        let thiz=this;
        AuthenticationService.verify({code: thiz.state.code, email: thiz.state.email}).then((res)=>{
            thiz.setState({message: "Verify email successfully! Please click the button bellow to login.", isSuccess: true});
        }).catch(function (error) {
            ErrorHandlerService.errorWithMessageFromAPI(error);
        });
    }

    btnSumitClick(){
        var thiz=this;
        if(thiz.state.isSuccess){
            thiz.setState({redirectToLogin: true});
        }
        else{
            //resend mail
        }
    }

    render(){
        if (this.state.redirectToLogin) {
            return <Redirect to='/admin/login'/>;
        }
        if(this.state.redirectToConfirm){
            return <Redirect to='/admin/confirm'/>;
        }

        return(
            <Layout>
                <div className="account-content text-center">
                    <span className="large-icon"><FontAwesomeIcon icon="envelope" /></span>

                    <p className="text-muted font-14 mt-2"> 
                        {this.state.message}
                    </p>

                    <a href="#" onClick={this.btnSumitClick} className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3">{this.state.isSuccess?"Go Login Page":"Resend Email"}</a>
                </div>
            </Layout>
        );
    }
}

export default VerifyEmail;