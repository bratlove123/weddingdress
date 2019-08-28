import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getCustomers, openUpdateCustomerDialog, deleteCustomerDispatch, resetState} from '../../Store/Actions/manageCustomerAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateCustomer from './UpdateCustomer';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import noAvatar from '../../assets/images/no_avatar.png';
import Common from '../../Consts/Common';

class ManageCustomer extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_CUSTOMERS",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.getCustomersItem=this.getCustomersItem.bind(this);
        this.editCustomer=this.editCustomer.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_CUSTOMERS");
    }

    deleteCustomer = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteCustomerDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateCustomerDialog();
    }

    componentWillMount(){
        this.props.getCustomers();
    }

    getCustomersItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getCustomers(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getCustomers(undefined, e.target.value);
    }

    changePage(page){
        this.props.getCustomers(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getCustomers(undefined, undefined, name, isAsc, nextArrow);
    }

    editCustomer=(id)=>()=>{
        this.props.openUpdateCustomerDialog(id);
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
                <UpdateCustomer modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateCustomer>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_CUSTOMER")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>      
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                        
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th>{i18n.t("CUS_IMAGE")}</th>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("CUS_NAME")}</SortHeading>
                                <th>{i18n.t("CUS_BIRTHDAY")}</th>
                                <th>{i18n.t("CUS_SEX")}</th>
                                <th>{i18n.t("CUS_ADDRESS")}</th>
                                <th>{i18n.t("CUS_PHONE")}</th>
                                <th>{i18n.t("CUS_FACEBOOK")}</th>
                                <th>{i18n.t("CUS_POINT")}</th>
                                <th>{i18n.t("CUS_GROUP_CUSTOMER")}</th>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingCustomers?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.customers.length>0 ? this.props.customers.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td><img className="list-img" src={value.image?Common.imgUrl+value.image:noAvatar}/></td>
                                                <td>{value.name}</td>
                                                <td><Moment date={value.birthday} format="DD/MM/YYYY"></Moment></td>
                                                <td>{value.sex?i18n.t("MALE"):i18n.t("FEMALE")}</td>
                                                <td>{value.address}</td>
                                                <td>{value.phone}</td>
                                                <td>{value.facebook}</td>
                                                <td>{value.point}</td>
                                                <td>{value.customerGroupId.title}</td>
                                                <td>{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td>
                                                    <button className="btn btn-warning" onClick={this.editCustomer(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteCustomer(value._id)}><FontAwesomeIcon icon="eraser" /></button>
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
        customers: state.manageCustomer.customers,
        isLoadingCustomers: state.manageCustomer.isLoadingCustomers,
        modalIsOpen: state.manageCustomer.modalIsOpen,
        isEdit: state.manageCustomer.isEdit,
        fixOpen: state.manageCustomer.fixOpen,
        redirectToLogin: state.manageCustomer.redirectToLogin,
        currentPage: state.manageCustomer.currentPage,
        totalPage: state.manageCustomer.totalPage,
        totalItemCount: state.manageCustomer.totalItemCount,
        orderBy: state.manageCustomer.orderBy,
        sort: state.manageCustomer.sort,
        search: state.manageCustomer.search,
        currentArrow: state.manageCustomer.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomers: (page, search, orderBy, sort, currentArrow) => dispatch(getCustomers(page, search, orderBy, sort, currentArrow)),
        openUpdateCustomerDialog: (id) => dispatch(openUpdateCustomerDialog(id)),
        deleteCustomerDispatch: (id) => dispatch(deleteCustomerDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageCustomer')(connect(mapStateToProps, mapDispatchToProps)(ManageCustomer));