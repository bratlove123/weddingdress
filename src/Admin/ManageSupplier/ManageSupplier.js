import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getSuppliers, openUpdateSupplierDialog, deleteSupplierDispatch, resetState} from '../../Store/Actions/manageSupplierAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateSupplier from './UpdateSupplier';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import noAvatar from '../../assets/images/no_avatar.png';
import Common from '../../Consts/Common';

class ManageSupplier extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_SUPPLIERS",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.getSuppliersItem=this.getSuppliersItem.bind(this);
        this.editSupplier=this.editSupplier.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_SUPPLIERS");
    }

    deleteSupplier = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteSupplierDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateSupplierDialog();
    }

    componentWillMount(){
        this.props.getSuppliers();
    }

    getSuppliersItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getSuppliers(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getSuppliers(undefined, e.target.value);
    }

    changePage(page){
        this.props.getSuppliers(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getSuppliers(undefined, undefined, name, isAsc, nextArrow);
    }

    editSupplier=(id)=>()=>{
        this.props.openUpdateSupplierDialog(id);
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
                <UpdateSupplier modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateSupplier>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_SUPPLIER")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>      
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                        
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th>{i18n.t("SUPPLIER_AVATAR")}</th>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("SUPPLIER_NAME")}</SortHeading>
                                <th>{i18n.t("SUPPLIER_EMAIL")}</th>
                                <th>{i18n.t("SUPPLIER_PHONE")}</th>
                                <th>{i18n.t("SUPPLIER_ADDRESS")}</th>
                                <th>{i18n.t("SUPPLIER_FACEBOOK")}</th>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingSuppliers?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.suppliers.length>0 ? this.props.suppliers.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td><img className="list-img" src={value.image?Common.imgUrl+value.image:noAvatar}/></td>
                                                <td>{value.name}</td>
                                                <td>{value.email}</td>
                                                <td>{value.phone}</td>
                                                <td>{value.address}</td>
                                                <td>{value.facebook}</td>
                                                <td>{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td>
                                                    <button className="btn btn-warning" onClick={this.editSupplier(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteSupplier(value._id)}><FontAwesomeIcon icon="eraser" /></button>
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
        suppliers: state.manageSupplier.suppliers,
        isLoadingSuppliers: state.manageSupplier.isLoadingSuppliers,
        modalIsOpen: state.manageSupplier.modalIsOpen,
        isEdit: state.manageSupplier.isEdit,
        fixOpen: state.manageSupplier.fixOpen,
        redirectToLogin: state.manageSupplier.redirectToLogin,
        currentPage: state.manageSupplier.currentPage,
        totalPage: state.manageSupplier.totalPage,
        totalItemCount: state.manageSupplier.totalItemCount,
        orderBy: state.manageSupplier.orderBy,
        sort: state.manageSupplier.sort,
        search: state.manageSupplier.search,
        currentArrow: state.manageSupplier.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getSuppliers: (page, search, orderBy, sort, currentArrow) => dispatch(getSuppliers(page, search, orderBy, sort, currentArrow)),
        openUpdateSupplierDialog: (id) => dispatch(openUpdateSupplierDialog(id)),
        deleteSupplierDispatch: (id) => dispatch(deleteSupplierDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageSupplier')(connect(mapStateToProps, mapDispatchToProps)(ManageSupplier));