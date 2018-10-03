import React, {Component} from 'react';
import logo from '../../assets/images/logo.png';

class Layout extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="account-pages">
                <div className="accountbg"></div>

                <div className="wrapper-page account-page-full">

                    <div className="card">
                        <div className="card-block">

                            <div className="account-box">

                                <div className="card-box p-5">
                                    <h2 className="text-uppercase text-center pb-4">
                                        <a href="index.html" className="text-success">
                                            <span><img src={logo} alt="" height="26"/></span>
                                        </a>
                                    </h2>
                                    
                                    {/* This is binding the form for children */}
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Layout;