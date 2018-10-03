import React, {Component} from 'react';
import avatar from '../../assets/images/users/avatar-1.jpg';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Redirect } from 'react-router';
import AuthenticationService from '../../Services/AuthenticationService';

class Control extends Component{
    authenticationService=new AuthenticationService();
    constructor(props){
        super(props);

        this.state={
            toggleControl:false,
            redirectToLogin: false
        };
        this.toggleControl=this.toggleControl.bind(this);
        this.handleOutsideClick=this.handleOutsideClick.bind(this);
        this.logOut=this.logOut.bind(this);
    }

    toggleControl(){
        this.setState({toggleControl:!this.state.toggleControl});
    }
    
    handleOutsideClick(e) {
        if (e.target && (e.target.className!="ml-1" && 
        e.target.className!="rounded-circle" && 
        e.target.className!="nav-link dropdown-toggle nav-user" &&
        e.target.className!="mdi mdi-chevron-down"
        )) {
            this.setState({toggleControl:false});
        }
    }
    
    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick, false);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    logOut(){
        this.authenticationService.removeToken();
        this.setState({redirectToLogin:true});
    }

    render(){
        if(this.state.redirectToLogin){
            return <Redirect to='/admin/login' />;
        }
        return(
            <li className="dropdown notification-list">
                <a onClick={this.toggleControl} className="nav-link dropdown-toggle nav-user" href="javascript:void(0);">
                    <img src={avatar} alt="user" className="rounded-circle"/> <span className="ml-1">Maxine K <i className="mdi mdi-chevron-down"></i> </span>
                </a>
                <CSSTransitionGroup transitionName="dropdownmenu" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                {this.state.toggleControl && <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                    <div className="dropdown-item noti-title">
                        <h6 className="text-overflow m-0">Welcome !</h6>
                    </div>

                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                        <i className="fi-head"></i> <span>My Account</span>
                    </a>

                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                        <i className="fi-cog"></i> <span>Settings</span>
                    </a>

                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                        <i className="fi-help"></i> <span>Support</span>
                    </a>

                    <a href="javascript:void(0);" className="dropdown-item notify-item">
                        <i className="fi-lock"></i> <span>Lock Screen</span>
                    </a>

                    <a onClick={this.logOut} href="javascript:void(0);" className="dropdown-item notify-item">
                        <i className="fi-power"></i> <span>Logout</span>
                    </a>

                </div>}
                </CSSTransitionGroup>
            </li>
        );
    }
}

export default Control;

