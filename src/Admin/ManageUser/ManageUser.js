import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {connect} from 'react-redux';
import UpdateUser from './UpdateUser';
import UpdatePermission from './UpdatePermission';
import ReactLoading from 'react-loading';
import {getUsers, openUpdateUserDialog, deleteUserDispatch, toggleActiveDispatch, resetState, openUpdatePermissionDialog} from '../../Store/Actions/manageUserAction';
import { Redirect } from 'react-router';
import noAvatar from '../../assets/images/no_avatar.png';
import Common from '../../Consts/Common';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import { confirmAlert } from 'react-confirm-alert';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class ManageUser extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_USERS",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewUser=this.addNewUser.bind(this);
        this.updateUser=this.updateUser.bind(this);
        this.changePage=this.changePage.bind(this);
        this.handleSearchChange=this.handleSearchChange.bind(this);
        this.sortChange=this.sortChange.bind(this);
        this.updatePermission=this.updatePermission.bind(this);
    }

    componentWillMount(){
        this.props.getUsers();
    }

    addNewUser(){
        this.props.openUpdateUserDialog();
    }

    updateUser=(id)=>()=>{
        this.props.openUpdateUserDialog(id);
    }

    updatePermission=(id)=>()=>{
        this.props.openUpdatePermissionDialog(id);
    }

    changePage(page){
        this.props.getUsers(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getUsers(undefined, undefined, name, isAsc, nextArrow);
    }

    handleSearchChange(e){
        this.props.getUsers(undefined, e.target.value);
    }

    deleteUser = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
                {
                    label: i18n.t("YES"),
                    onClick: () => {
                        this.props.deleteUserDispatch(id);
                    }
                },
                {
                    label: i18n.t("NO")
                }
            ]
        })
    };

    toggleActiveDispatch = (id, isActive, isEmail) => () => {
        confirmAlert({
            title: i18n.t("ACTIVE_CONFIRM"),
            message: i18n.t("SURE_ACTIVE"),
            buttons: [
                {
                    label: i18n.t("YES"),
                    onClick: () => {
                        this.props.toggleActiveDispatch(id, isActive, isEmail);
                    }
                },
                {
                    label: i18n.t("NO")
                }
            ]
        })
    };

    componentWillUnmount(){
        this.props.resetState();
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
                <UpdatePermission modalPermissionIsOpen={this.props.modalPermissionIsOpen} fixOpenPermission={this.props.fixOpenPermission}></UpdatePermission>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewUser} >{i18n.t("ADD_NEW_USER")} </button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>
                            <input onChange={this.handleSearchChange} type="text" name="search" className="form-control search-box" placeholder={i18n.t("SEARCH")}  /> 
                        </div>
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th>{i18n.t("AVATAR")} </th>
                                <SortHeading name={'userName'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("USER_NAME")} </SortHeading>
                                <SortHeading name={'email'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("EMAIL")} </SortHeading>
                                <SortHeading name={'firstName'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("FULL_NAME")} </SortHeading>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingUsers?<tr><td colSpan="6"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                            this.props.users.length>0 ? this.props.users.map((user, i)=>{
                                return (
                                    <tr className={user.isActive && user.isConfirmEmail?'':'in-active'} key={i}>
                                        <td><img className="list-img" src={user.image?Common.imgUrl+user.image:noAvatar}/></td>
                                        <td><b>{user.userName}</b></td>
                                        <td>{user.email}</td>
                                        <td>{user.firstName + " " + user.lastName}</td>
                                        <td>{user.modifiedBy && user.modifiedBy.userName}</td>
                                        <td><Moment date={user.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                        <td className="action-list">
                                            <span title="Edit" className="text-warning" onClick={this.updateUser(user._id)}><FontAwesomeIcon icon="pencil-alt" /></span>
                                            <span title="Update Roles" className="text-info" onClick={this.updatePermission(user._id)}><FontAwesomeIcon icon="user-tag" /></span>
                                            <span title="Delete" className="text-danger" onClick={this.deleteUser(user._id)}><FontAwesomeIcon icon="eraser" /></span>
                                            {user.isActive?<span title="Toggle Active" className="text-success" onClick={this.toggleActiveDispatch(user._id, user.isActive, false)}><FontAwesomeIcon icon="user-alt" /></span>:
                                            <span title="Toggle Active" className="text-secondary" onClick={this.toggleActiveDispatch(user._id, user.isActive, false)}><FontAwesomeIcon icon="user-alt-slash" /></span>}
                                            {user.isConfirmEmail?<span title="Toggle Active Email" className="text-success" onClick={this.toggleActiveDispatch(user._id, user.isConfirmEmail, true)}><FontAwesomeIcon icon="envelope" /></span>:
                                            <span title="Toggle Active Email" className="text-secondary" onClick={this.toggleActiveDispatch(user._id, user.isConfirmEmail, true)}><FontAwesomeIcon icon="envelope" /></span>}
                                        </td>
                                    </tr>
                                )
                            }):<tr><td colSpan="100%" className="text-center">{i18n.t("NO_DATA")} </td></tr>
                        }
                        </tbody>
                    </table>
                </div>
                <Paging getData={this.changePage} currentPage={this.props.currentPage} totalPage={this.props.totalPage} totalItemCount={this.props.totalItemCount}></Paging>
            </Layout>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        users: state.manageUser.users,
        isLoadingUsers: state.manageUser.isLoadingUsers,
        modalIsOpen: state.manageUser.modalIsOpen,
        modalPermissionIsOpen: state.manageUser.modalPermissionIsOpen,
        fixOpenPermission: state.manageUser.fixOpenPermission,
        isEdit: state.manageUser.isEdit,
        fixOpen: state.manageUser.fixOpen,
        redirectToLogin: state.manageUser.redirectToLogin,
        currentPage: state.manageUser.currentPage,
        totalPage: state.manageUser.totalPage,
        totalItemCount: state.manageUser.totalItemCount,
        orderBy: state.manageUser.orderBy,
        sort: state.manageUser.sort,
        search: state.manageUser.search,
        currentArrow: state.manageUser.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUsers: (page, search, orderBy, sort, currentArrow) => dispatch(getUsers(page, search, orderBy, sort, currentArrow)),
        openUpdateUserDialog: (id) => dispatch(openUpdateUserDialog(id)),
        deleteUserDispatch: (id) => dispatch(deleteUserDispatch(id)),
        openUpdatePermissionDialog: (id) => dispatch(openUpdatePermissionDialog(id)),
        resetState: () => dispatch(resetState()),
        toggleActiveDispatch: (id, isActive, isEmail) => dispatch(toggleActiveDispatch(id, isActive, isEmail))
    }
}

export default withNamespaces('manageUser')(connect(mapStateToProps, mapDispatchToProps)(ManageUser));