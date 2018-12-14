import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux';
import UpdateUser from './UpdateUser';
import ReactLoading from 'react-loading';
import {getUsers} from '../../Store/Actions/manageUserAction';
import {openUpdateUserDialog} from '../../Store/Actions/manageUserAction';
import { Redirect } from 'react-router';

class ManageUser extends Component{
    breadcrumb = [
        {
            name: "Configuration",
            url: ""
        },
        {
            name: "Manage User",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewUser=this.addNewUser.bind(this);
        this.updateUser=this.updateUser.bind(this);
    }

    componentWillMount(){
        this.props.getUsers();
    }

    addNewUser(){
        this.props.openUpdateUserDialog();
    }

    updateUser(){
        this.setState({modalIsOpen: true, isEdit: true});
    }

    render(){
        if(this.props.redirectToLogin){
            return <Redirect to={{
                pathname: '/admin/login',
                state: { currentUrl: this.props.location.pathname }
            }} />;
        }
        return(
            <Layout breadcrumb={this.breadcrumb}>
                <UpdateUser modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateUser>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewUser} >Add New User</button>
                        <input name="currentSearch" className="form-control search-box" placeholder="Search" />
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>Username</th>
                                <th> Email </th>
                                <th> Fullname </th>
                                <th> Role </th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingUsers?<tr><td colSpan="6"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                            this.props.users.map((user, i)=>{
                                return (
                                    <tr key={i}>
                                        <td>{user.avatar}</td>
                                        <td><b>{user.userName}</b></td>
                                        <td>{user.email}</td>
                                        <td>{user.firstName + " " + user.lastName}</td>
                                        <td>Admin</td>
                                        <td className="text-center">
                                            <button className="btn btn-warning" onClick={this.updateUser}><FontAwesomeIcon icon="pencil-alt" /></button>
                                            <button className="btn btn-danger fix-eraser-btn"><FontAwesomeIcon icon="eraser" /></button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        users: state.manageUser.users,
        isLoadingUsers: state.manageUser.isLoadingUsers,
        modalIsOpen: state.manageUser.modalIsOpen,
        isEdit: state.manageUser.modalIsOpen,
        fixOpen: state.manageUser.fixOpen,
        redirectToLogin: state.manageUser.redirectToLogin
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUsers: () => dispatch(getUsers()),
        openUpdateUserDialog: (id) => dispatch(openUpdateUserDialog())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);