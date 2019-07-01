import React, {Component} from 'react';
import logo from '../../assets/images/logo.png';
import { ToastContainer } from 'react-toastify';
import vi from '../../assets/images/vi.png';
import en from '../../assets/images/en.jpg';
import i18n from '../../Consts/i18n';
import { withNamespaces } from 'react-i18next';

class Layout extends Component{
    constructor(props){
        super(props);
    }

    changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    }

    render(){
        return(
            <div className="account-pages">
               
                <ToastContainer/>
                <div className="accountbg"></div>

                <div className="wrapper-page account-page-full">

                    <div className="card">
                        <div className="card-block">
                        
                            <div className="account-box">

                                <div className="card-box p-5 fix-card-box">
                                    <h2 className="text-uppercase text-center pb-4">
                                        <a href="index.html" className="text-success">
                                            <span><img src={logo} alt="" height="26"/></span>
                                        </a>
                                    </h2>
                                    
                                    {/* This is binding the form for children */}
                                    {this.props.children}
                                </div>
                                <div className="change-lang">
                                    {i18n.languages[0]==='vi'?<div className="lang-holder">
                                        <img src={vi}/>
                                    </div>:
                                    <div className="lang-holder">
                                        <img src={en}/>
                                    </div>}
                                    <div id="choose-lang">
                                        <div onClick={() => this.changeLanguage('vi')} className="choose-lang-holder">
                                            <img src={vi}/>
                                            <span>
                                                Tiếng Việt
                                            </span>
                                        </div>
                                        <div onClick={() => this.changeLanguage('en')} className="choose-lang-holder">
                                            <img src={en}/>
                                            <span>
                                                English
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        );
    }
}

export default withNamespaces('auth')(Layout);