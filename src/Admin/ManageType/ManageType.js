import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getTypes, openUpdateTypeDialog, deleteTypeDispatch, resetState} from '../../Store/Actions/manageTypeAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateType from './UpdateType';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class ManageType extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_TYPES",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.toggleRow=this.toggleRow.bind(this);
        this.getTypesItem=this.getTypesItem.bind(this);
        this.editType=this.editType.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_TYPES");
    }

    toggleRow=(i)=>()=>{
        const types = this.props.types.map((child, sidx) => {
            if (sidx !== i) return child;
            child.isExpand=!child.isExpand;
            return child;
        });

        this.setState({types:types});
    }

    deleteType = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteTypeDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateTypeDialog();
    }

    componentWillMount(){
        this.props.getTypes();
    }

    getTypesItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getTypes(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getTypes(undefined, e.target.value);
    }

    changePage(page){
        this.props.getTypes(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getTypes(undefined, undefined, name, isAsc, nextArrow);
    }

    editType=(id)=>()=>{
        this.props.openUpdateTypeDialog(id);
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
                <UpdateType modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateType>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_TYPE")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>      
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                        
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th></th>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("TYPE_NAME")}</SortHeading>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingTypes?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.types.length>0 ? this.props.types.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td onClick={this.toggleRow(i)}>{value.isExpand?<FontAwesomeIcon icon="minus-square" />:<FontAwesomeIcon icon="plus-square" />}</td>
                                                <td onClick={this.toggleRow(i)}>{value.name}</td>
                                                <td onClick={this.toggleRow(i)} className="text-center">{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td onClick={this.toggleRow(i)} className="text-center"><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td className="text-center">
                                                    <button className="btn btn-warning" onClick={this.editType(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteType(value._id)}><FontAwesomeIcon icon="eraser" /></button>
                                                </td>
                                                
                                            </tr>
                                            {
                                                value.sizes.length>0&&value.sizes[0].name&&value.isExpand&&<React.Fragment>
                                                {
                                                    value.sizes.map((value, i)=>{
                                                        return(
                                                            <tr key={i}>
                                                                <td colSpan="3"></td>
                                                                <td colSpan="2">{value.name}</td>
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
        types: state.manageType.types,
        isLoadingTypes: state.manageType.isLoadingTypes,
        modalIsOpen: state.manageType.modalIsOpen,
        isEdit: state.manageType.isEdit,
        fixOpen: state.manageType.fixOpen,
        redirectToLogin: state.manageType.redirectToLogin,
        currentPage: state.manageType.currentPage,
        totalPage: state.manageType.totalPage,
        totalItemCount: state.manageType.totalItemCount,
        orderBy: state.manageType.orderBy,
        sort: state.manageType.sort,
        search: state.manageType.search,
        currentArrow: state.manageType.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getTypes: (page, search, orderBy, sort, currentArrow) => dispatch(getTypes(page, search, orderBy, sort, currentArrow)),
        openUpdateTypeDialog: (id) => dispatch(openUpdateTypeDialog(id)),
        deleteTypeDispatch: (id) => dispatch(deleteTypeDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageType')(connect(mapStateToProps, mapDispatchToProps)(ManageType));