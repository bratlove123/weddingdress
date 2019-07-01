import React, {Component} from 'react';
import Layout from './Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AuthenticationService from '../../Services/AuthenticationService';
import ErrorHandlerService from '../../Services/ErrorHandlerService';
import { toast } from 'react-toastify';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

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
            toast(i18n.t('RESEND_EMAIL_SUCCESS'), { type: toast.TYPE.SUCCESS });
        }).catch(function (error) {
            ErrorHandlerService.errorWithMessageFromAPI(error);
        });
    }
    
    render(){
        return(
            <Layout>
                <div className="account-content text-center">
                    <span className="large-icon"><FontAwesomeIcon icon="envelope" /></span>

                    <p className="text-muted font-14 mt-2"> {i18n.t('CONFIRM_EMAIL_MESSAGE_FIRST')} <b>{this.state.email}</b>.
                    {i18n.t('CONFIRM_EMAIL_MESSAGE_NOTE')}  </p>

                    <a href="#" onClick={this.resendEmail} className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3">{i18n.t('RESEND_EMAIL')}</a>
                </div>
            </Layout>
        );
    }
}

export default withNamespaces('comfirm')(ConfirmEmail);