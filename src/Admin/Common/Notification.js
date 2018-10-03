import React, {Component} from 'react';

class Notification extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <li className="dropdown notification-list">
                <a className="nav-link dropdown-toggle arrow-none" data-toggle="dropdown" href="#" role="button"
                    aria-haspopup="false" aria-expanded="false">
                    <i className="fi-bell noti-icon"></i>
                    <span className="badge badge-danger badge-pill noti-icon-badge">4</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right dropdown-menu-animated dropdown-lg">

                    <div className="dropdown-item noti-title">
                        <h5 className="m-0"><span className="float-right"><a href="" className="text-dark"><small>Clear All</small></a> </span>Notification</h5>
                    </div>

                    <div className="slimscroll slimscroll-fix">

                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                            <div className="notify-icon bg-success"><i className="mdi mdi-comment-account-outline"></i></div>
                            <p className="notify-details">Caleb Flakelar commented on Admin<small className="text-muted">1 min ago</small></p>
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                            <div className="notify-icon bg-info"><i className="mdi mdi-account-plus"></i></div>
                            <p className="notify-details">New user registered.<small className="text-muted">5 hours ago</small></p>
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                            <div className="notify-icon bg-danger"><i className="mdi mdi-heart"></i></div>
                            <p className="notify-details">Carlos Crouch liked <b>Admin</b><small className="text-muted">3 days ago</small></p>
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                            <div className="notify-icon bg-warning"><i className="mdi mdi-comment-account-outline"></i></div>
                            <p className="notify-details">Caleb Flakelar commented on Admin<small className="text-muted">4 days ago</small></p>
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                            <div className="notify-icon bg-purple"><i className="mdi mdi-account-plus"></i></div>
                            <p className="notify-details">New user registered.<small className="text-muted">7 days ago</small></p>
                        </a>

                        <a href="javascript:void(0);" className="dropdown-item notify-item">
                            <div className="notify-icon bg-custom"><i className="mdi mdi-heart"></i></div>
                            <p className="notify-details">Carlos Crouch liked <b>Admin</b><small className="text-muted">13 days ago</small></p>
                        </a>
                    </div>

                    <a href="javascript:void(0);" className="dropdown-item text-center text-primary notify-item notify-all">
                        View all <i className="fi-arrow-right"></i>
                    </a>

                </div>
            </li>
        );
    }
}

export default Notification;

