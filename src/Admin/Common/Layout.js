import React, {Component} from 'react';
import LeftNav from './LeftNav';
import TopNav from './TopNav';
import { Redirect } from 'react-router';
import AuthenticationService from '../../Services/AuthenticationService';

class Layout extends Component{
    authService = new AuthenticationService();

    constructor(props){
        super(props);

        this.state={
            redirectToLogin:false
        };
    }

    componentWillMount(){
        let that=this;
        that.authService.checkLogon(this.authService.getToken()).then((res)=>{

        }).catch(function (error) {
            that.setState({ redirectToLogin: true });
        });
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