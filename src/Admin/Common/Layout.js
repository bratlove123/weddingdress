import React, {Component} from 'react';
import LeftNav from './LeftNav';
import TopNav from './TopNav';
import { Redirect } from 'react-router';
import { ToastContainer } from 'react-toastify';

class Layout extends Component{
    constructor(props){
        super(props);

        this.state={
            redirectToLogin:false
        };
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
                <ToastContainer/>
                <LeftNav/>
                <div className="content-page">
                    <TopNav breadcrumb={this.props.breadcrumb} />
                    <div className="content">
                        {this.props.children}
                    </div>
                    <footer className="footer text-right">
                        2018 © Highdmin. - Coderthemes.com
                    </footer>
                </div>
            </div>
        );
    }
}

export default Layout;