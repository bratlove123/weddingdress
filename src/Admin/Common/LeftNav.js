import React, {Component} from 'react';
import logo from '../../assets/images/logo.png';
import logoSm from '../../assets/images/logo_sm.png';
import avatar from '../../assets/images/users/avatar-1.jpg'
import LeftNavItem from './LeftNavItem';
import { Scrollbars } from 'react-custom-scrollbars';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import { Redirect } from 'react-router';
import {getLeftNavsMenu, resetState} from '../../Store/Actions/leftNavAction';
import Common from '../../Consts/Common';

class LeftNav extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props.getLeftNavsMenu();
    }

    componentWillUnmount(){
        this.props.resetState();
    }

    render(){
        if(this.props.redirectToLoginLeftNav){
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
                                <img src={this.props.userInfo&&this.props.userInfo.avatar?Common.imgUrl+this.props.userInfo.avatar:avatar} alt="user-img" className="rounded-circle img-fluid"/>
                            </div>
                            <h5><a href="#">{this.props.userInfo&&this.props.userInfo.fullName?this.props.userInfo.fullName:"No name"}</a> </h5>
                            <p className="text-muted">{this.props.userInfo&&this.props.userInfo.role?this.props.userInfo.role:"No role"}</p>
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
        redirectToLoginLeftNav:state.leftNav.redirectToLoginLeftNav
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getLeftNavsMenu: () => dispatch(getLeftNavsMenu()),
        resetState: () => dispatch(resetState())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);