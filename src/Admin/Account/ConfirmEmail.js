import React, {Component} from 'react';
import Layout from './Layout';
import AuthenticationService from '../../Services/AuthenticationService';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ConfirmEmail extends Component{
    authService = new AuthenticationService();
    constructor(props){
        super(props);
        this.state = {
            email: this.props.location.state.email
        };
    }

    render(){
        return(
            <Layout>
                <ToastContainer />
                <div className="account-content text-center">
                    <span className="large-icon"><FontAwesomeIcon icon="envelope" /></span>

                    <p className="text-muted font-14 mt-2"> A email has been send to <b>{this.state.email}</b>.
                        Please check for an email from company and follow the instructions, if you have not received yet, please click the button below, we will resend a verify email for you. </p>

                    <a href="#" className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3">Resend Email</a>
                </div>
            </Layout>
        );
    }
}

export default ConfirmEmail;