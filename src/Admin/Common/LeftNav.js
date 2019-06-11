import React, {Component} from 'react';
import logo from '../../assets/images/logo.png';
import logoSm from '../../assets/images/logo_sm.png';
import avatar from '../../assets/images/users/avatar-1.jpg'
import LeftNavItem from './LeftNavItem';
import { Scrollbars } from 'react-custom-scrollbars';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import {getLeftNavsMenu} from '../../Store/Actions/leftNavAction';

class LeftNav extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.getLeftNavsMenu();
    }

    render(){
        if(this.props.redirectToLogin){
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
                                <img src={this.props.userInfo&&this.props.userInfo.avatar?this.props.userInfo.avatar:avatar} alt="user-img" className="rounded-circle img-fluid"/>
                            </div>
                            <h5><a href="#">{this.props.userInfo&&this.props.userInfo.fullName?this.props.userInfo.fullName:""}</a> </h5>
                            <p className="text-muted">{this.props.userInfo&&this.props.userInfo.role?this.props.userInfo.role:"N/A"}</p>
                        </div>

                        <div id="sidebar-menu">

                            <ul className="metismenu" id="side-menu">
                                {this.props.leftNavItems.map((item, i) => {        
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

const mapStateToProps=(state)=>{
    return {
        leftNavItems: state.leftNav.leftNavItems,
        userInfo: state.leftNav.userInfo,
        redirectToLogin:state.leftNav.redirectToLogin
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getLeftNavsMenu: () => dispatch(getLeftNavsMenu())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);