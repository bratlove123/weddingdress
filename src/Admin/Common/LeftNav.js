import React, {Component} from 'react';
import logo from '../../assets/images/logo.png';
import logoSm from '../../assets/images/logo_sm.png';
import avatar from '../../assets/images/users/avatar-1.jpg'
import LeftNavItem from './LeftNavItem';
import { Scrollbars } from 'react-custom-scrollbars';
import LeftNavService from '../../Services/LeftNavService';
import AuthenticationService from '../../Services/AuthenticationService';
import ErrorHandlerService from '../../Services/ErrorHandlerService';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import { Redirect } from 'react-router';

class LeftNav extends Component{
    leftNavService=new LeftNavService();
    authenticationService=new AuthenticationService();
    errorHandlerService=new ErrorHandlerService();

    constructor(props){
        super(props);
        this.state = {
            leftNavItems: [],
            userInfo: {
                userName: "",
                fullName: "",
                email: "",
                avatar: "",
                role: ""
            },
            redirectToLogin:false
        };
    }

    componentDidMount(){
        let thiz=this;
        thiz.leftNavService.getLeftNavs(thiz.authenticationService.getToken()).then((res)=>{
            if(res.data){
                thiz.setState(
                    {
                        leftNavItems: res.data,
                        userInfo: thiz.authenticationService.getUserLoginInfo()
                    }
                );
            }
        }).catch(function (error) {
            thiz.errorHandlerService.basicErrorHandler(error, toast, thiz);
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
            <div className="left side-menu">

                <div className="slimscroll-menu" id="remove-scroll">

                    <div className="topbar-left">
                        <Link to="/admin" className="logo">
                            <span>
                                <img src={logo} alt="" height="22"/>
                            </span>
                            <i>
                                <img src={logoSm} alt="" height="28"/>
                            </i>
                        </Link>
                    </div>

                    <Scrollbars autoHeight autoHeightMin={900} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                        <div className="user-box">
                            <div className="user-img">
                                <img src={this.state.userInfo&&this.state.userInfo.avatar?this.state.userInfo.avatar:avatar} alt="user-img" className="rounded-circle img-fluid"/>
                            </div>
                            <h5><a href="#">{this.state.userInfo&&this.state.userInfo.fullName.trim()?this.state.userInfo.fullName:this.state.userInfo.userName}</a> </h5>
                            <p className="text-muted">{this.state.userInfo&&this.state.userInfo.role?this.state.userInfo.role:"N/A"}</p>
                        </div>

                        <div id="sidebar-menu">

                            <ul className="metismenu" id="side-menu">
                                {this.state.leftNavItems.map((item, i) => {        
                                    return (<LeftNavItem key={i} config={item} />) 
                                })}
                            </ul>

                        </div>
                    </Scrollbars>
                   
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}

export default LeftNav;