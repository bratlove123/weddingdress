import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux';
import UpdateUser from './UpdateUser';

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

        this.state={
            modalIsOpen: false,
            isEdit: false
        };
        this.addNewUser=this.addNewUser.bind(this);
    }

    addNewUser(){
        this.setState({modalIsOpen: true});
    }

    render(){
        return(
            <Layout breadcrumb={this.breadcrumb}>
                <UpdateUser modalIsOpen={this.state.modalIsOpen} isEdit={this.state.isEdit}></UpdateUser>
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
                            <tr>
                                <td>Avatar</td>
                                <td><b>Administrator</b></td>
                                <td>thaiphong.spkt@gmail.com</td>
                                <td>Phong Ho</td>
                                <td>Admin</td>
                                <td className="text-center">
                                    <button className="btn btn-warning"><FontAwesomeIcon icon="pencil-alt" /></button>
                                    <button className="btn btn-danger fix-eraser-btn"><FontAwesomeIcon icon="eraser" /></button>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        users: state.manageUser.users
    }
}

export default connect(mapStateToProps)(ManageUser);