import React, {Component} from 'react';
import LeftNav from './LeftNav';
import TopNav from './TopNav';
import { Redirect } from 'react-router';
import { ToastContainer } from 'react-toastify';
import GlobalLoading from '../../Common/GlobalLoading';
import {connect} from 'react-redux';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import vi from '../../assets/images/vi.png';
import en from '../../assets/images/en.jpg';

class Layout extends Component{
    constructor(props){
        super(props);

        this.state={
            redirectToLogin:false
        };
    }

    changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }
    
    render(){
        if(this.state.redirectToLogin){
            return <Redirect to={{
                pathname: '/admin/login',
                state: { currentUrl: window.location.pathname }
            }} />;
        }

        return(
            <div id="wrapper">
                {this.props.isShowGlobalLoading?<GlobalLoading/>:""}
                <ToastContainer/>
                <LeftNav/>
                <div className="content-page">
                    <TopNav breadcrumb={this.props.breadcrumb} />
                    <div className="content">
                        {this.props.children}
                    </div>
                    <footer className="footer text-right">
                        2018 © - Wedding Dress

                        <div className="change-lang-main">
                            {i18n.languages[0]==='vi'?<div className="lang-holder">
                                <img src={vi}/>
                            </div>:
                            <div className="lang-holder">
                                <img src={en}/>
                            </div>}
                            <div id="choose-lang-main">
                                <div onClick={() => this.changeLanguage('vi')} className="choose-lang-holder">
                                    <img src={vi} title="Tiếng việt"/>
                                </div>
                                <div onClick={() => this.changeLanguage('en')} className="choose-lang-holder">
                                    <img src={en} title="English"/>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export const mapStateToProps = (state) =>{
    return {
        isShowGlobalLoading: state.app.isShowGlobalLoading
    }
}

export default withNamespaces('layout')(connect(mapStateToProps)(Layout));