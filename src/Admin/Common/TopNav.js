import React, {Component} from 'react';
import Notification from './Notification';
import Comment from './Comment';
import Control from './Control';
import Breadcrumb from './Breadcrumb';

class TopNav extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="topbar">

                    <nav className="navbar-custom">

                        <ul className="list-unstyled topbar-right-menu float-right mb-0">

                            <li className="hide-phone app-search">
                                <form>
                                    <input type="text" placeholder="Search..." className="form-control"/>
                                    <button type="submit"><i className="fa fa-search"></i></button>
                                </form>
                            </li>

                            <Notification/>
                            <Comment/>
                            <Control/>
                        </ul>
                        
                        <Breadcrumb breadcrumb={this.props.breadcrumb}/>
                    </nav>

                </div>
        );
    }
}

export default TopNav;