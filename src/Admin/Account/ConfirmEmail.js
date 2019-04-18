import React, {Component} from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthenticationService from '../../Services/AuthenticationService';
import ErrorHandlerService from '../../Services/ErrorHandlerService';
import { toast } from 'react-toastify';

class ConfirmEmail extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: this.props.location.state.email
        };
        this.resendEmail=this.resendEmail.bind(this);
    }

    resendEmail(){
        let thiz=this;
        AuthenticationService.sendEmailVerify({email: thiz.state.email}).then((res)=>{
            toast("Resend email successfull, please check your mail inbox again.", { type: toast.TYPE.SUCCESS });
        }).catch(function (error) {
            ErrorHandlerService.errorWithMessageFromAPI(error);
        });
    }
    
    render(){
        return(
            <Layout>
                <div className="account-content text-center">
                    <span className="large-icon"><FontAwesomeIcon icon="envelope" /></span>

                    <p className="text-muted font-14 mt-2"> A email has been send to <b>{this.state.email}</b>.
                        Please check for an email from company and follow the instructions, if you have not received yet, please click the button below, we will resend a verify email for you. </p>

                    <a href="#" onClick={this.resendEmail} className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3">Resend Email</a>
                </div>
            </Layout>
        );
    }
}

export default ConfirmEmail;