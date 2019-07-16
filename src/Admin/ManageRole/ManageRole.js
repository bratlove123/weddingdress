import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getRoleGroups, openUpdateRoleGroupDialog, deleteRoleGroupDispatch, resetState} from '../../Store/Actions/ManageRoleAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateRole from './UpdateRole';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class ManageRole extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_ROLES",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.toggleRow=this.toggleRow.bind(this);
        this.getRoleGroups=this.getRoleGroups.bind(this);
        this.editRoleGroup=this.editRoleGroup.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_ROLES");
    }

    toggleRow=(i)=>()=>{
        const roleGroups = this.props.roleGroups.map((child, sidx) => {
            if (sidx !== i) return child;
            child.isExpand=!child.isExpand;
            return child;
        });

        this.setState({roleGroups:roleGroups});
    }

    deleteRoleGroup = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteRoleGroupDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateRoleGroupDialog();
    }

    componentWillMount(){
        this.props.getRoleGroups();
    }

    getRoleGroups(pageSize, pageNumber, orderBy, sort, search){
        this.props.getRoleGroups(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getRoleGroups(undefined, e.target.value);
    }

    changePage(page){
        this.props.getRoleGroups(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getRoleGroups(undefined, undefined, name, isAsc, nextArrow);
    }

    editRoleGroup=(id)=>()=>{
        this.props.openUpdateRoleGroupDialog(id);
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
                <UpdateRole modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateRole>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_ROLE")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>    
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th></th>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("NAME")}</SortHeading>
                                <SortHeading name={'code'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("CODE")}</SortHeading>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingRoleGroups?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.roleGroups.length>0 ? this.props.roleGroups.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td onClick={this.toggleRow(i)}>{value.isExpand?<FontAwesomeIcon icon="minus-square" />:<FontAwesomeIcon icon="plus-square" />}</td>
                                                <td onClick={this.toggleRow(i)}>{value.name}</td>
                                                <td onClick={this.toggleRow(i)}>{value.code}</td>
                                                <td onClick={this.toggleRow(i)}>{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td onClick={this.toggleRow(i)}><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td>
                                                    <button className="btn btn-warning" onClick={this.editRoleGroup(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteRoleGroup(value._id)}><FontAwesomeIcon icon="eraser" /></button>
                                                </td>
                                                
                                            </tr>
                                            {
                                                value.childs.length>0&&value.isExpand&&<React.Fragment>
                                                {
                                                    value.childs.map((value, i)=>{
                                                        return(
                                                            <tr key={i}>
                                                                <td colSpan="3"></td>
                                                                <td colSpan="2">{value.name}</td>
                                                                <td colSpan="2">{value.code}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    )
                                }):<tr><td colSpan="100%" className="text-center">{i18n.t("NO_DATA")}</td></tr>
                            }
                        </tbody>
                    </table>
                    <Paging getData={this.changePage} currentPage={this.props.currentPage} totalPage={this.props.totalPage} totalItemCount={this.props.totalItemCount}></Paging>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps=(state)=>{
    return {
        roleGroups: state.manageRoleGroup.roleGroups,
        isLoadingRoleGroups: state.manageRoleGroup.isLoadingRoleGroups,
        modalIsOpen: state.manageRoleGroup.modalIsOpen,
        isEdit: state.manageRoleGroup.isEdit,
        fixOpen: state.manageRoleGroup.fixOpen,
        redirectToLogin: state.manageRoleGroup.redirectToLogin,
        currentPage: state.manageRoleGroup.currentPage,
        totalPage: state.manageRoleGroup.totalPage,
        totalItemCount: state.manageRoleGroup.totalItemCount,
        orderBy: state.manageRoleGroup.orderBy,
        sort: state.manageRoleGroup.sort,
        search: state.manageRoleGroup.search,
        currentArrow: state.manageRoleGroup.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getRoleGroups: (page, search, orderBy, sort, currentArrow) => dispatch(getRoleGroups(page, search, orderBy, sort, currentArrow)),
        openUpdateRoleGroupDialog: (id) => dispatch(openUpdateRoleGroupDialog(id)),
        deleteRoleGroupDispatch: (id) => dispatch(deleteRoleGroupDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageLeftNav')(connect(mapStateToProps, mapDispatchToProps)(ManageRole));