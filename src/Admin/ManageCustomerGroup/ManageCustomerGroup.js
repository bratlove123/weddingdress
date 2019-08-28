import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getCustomerGroups, openUpdateCustomerGroupDialog, deleteCustomerGroupDispatch, resetState} from '../../Store/Actions/manageCustomerGroupAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateCustomerGroup from './UpdateCustomerGroup';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import noAvatar from '../../assets/images/no_avatar.png';
import Common from '../../Consts/Common';

class ManageCustomerGroup extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_CUSTOMER_GROUPS",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.getCustomerGroupsItem=this.getCustomerGroupsItem.bind(this);
        this.editCustomerGroup=this.editCustomerGroup.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_CUSTOMER_GROUPS");
    }

    deleteCustomerGroup = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteCustomerGroupDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateCustomerGroupDialog();
    }

    componentWillMount(){
        this.props.getCustomerGroups();
    }

    getCustomerGroupsItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getCustomerGroups(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getCustomerGroups(undefined, e.target.value);
    }

    changePage(page){
        this.props.getCustomerGroups(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getCustomerGroups(undefined, undefined, name, isAsc, nextArrow);
    }

    editCustomerGroup=(id)=>()=>{
        this.props.openUpdateCustomerGroupDialog(id);
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
                <UpdateCustomerGroup modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateCustomerGroup>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_CUSTOMER_GROUP")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>      
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                        
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th>{i18n.t("CUS_GROUP_IMAGE")}</th>
                                <SortHeading name={'title'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("CUS_GROUP_TITLE")}</SortHeading>
                                <SortHeading name={'level'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("CUS_GROUP_LEVEL")}</SortHeading>
                                <th>{i18n.t("CUS_GROUP_TARGET_POINT")}</th>
                                <th>{i18n.t("CUS_GROUP_MIN_MONEY")}</th>
                                <th>{i18n.t("CUS_GROUP_DISCOUNT")}</th>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingCustomerGroups?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.customerGroups.length>0 ? this.props.customerGroups.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td><img className="list-img" src={value.image?Common.imgUrl+value.image:noAvatar}/></td>
                                                <td>{value.title}</td>
                                                <td>{value.level}</td>
                                                <td>{value.targetPoint}</td>
                                                <td>{value.minMoney}</td>
                                                <td>{value.discount}</td>
                                                <td>{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td>
                                                    <button className="btn btn-warning" onClick={this.editCustomerGroup(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteCustomerGroup(value._id)}><FontAwesomeIcon icon="eraser" /></button>
                                                </td>
                                                
                                            </tr>
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
        customerGroups: state.manageCustomerGroup.customerGroups,
        isLoadingCustomerGroups: state.manageCustomerGroup.isLoadingCustomerGroups,
        modalIsOpen: state.manageCustomerGroup.modalIsOpen,
        isEdit: state.manageCustomerGroup.isEdit,
        fixOpen: state.manageCustomerGroup.fixOpen,
        redirectToLogin: state.manageCustomerGroup.redirectToLogin,
        currentPage: state.manageCustomerGroup.currentPage,
        totalPage: state.manageCustomerGroup.totalPage,
        totalItemCount: state.manageCustomerGroup.totalItemCount,
        orderBy: state.manageCustomerGroup.orderBy,
        sort: state.manageCustomerGroup.sort,
        search: state.manageCustomerGroup.search,
        currentArrow: state.manageCustomerGroup.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomerGroups: (page, search, orderBy, sort, currentArrow) => dispatch(getCustomerGroups(page, search, orderBy, sort, currentArrow)),
        openUpdateCustomerGroupDialog: (id) => dispatch(openUpdateCustomerGroupDialog(id)),
        deleteCustomerGroupDispatch: (id) => dispatch(deleteCustomerGroupDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageCustomerGroup')(connect(mapStateToProps, mapDispatchToProps)(ManageCustomerGroup));