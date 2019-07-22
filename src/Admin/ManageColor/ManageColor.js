import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getColors, openUpdateColorDialog, deleteColorDispatch, resetState} from '../../Store/Actions/manageColorAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateColor from './UpdateColor';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class ManageColor extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_COLORS",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.getColorsItem=this.getColorsItem.bind(this);
        this.editColor=this.editColor.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_COLORS");
    }

    deleteColor = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteColorDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateColorDialog();
    }

    componentWillMount(){
        this.props.getColors();
    }

    getColorsItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getColors(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getColors(undefined, e.target.value);
    }

    changePage(page){
        this.props.getColors(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getColors(undefined, undefined, name, isAsc, nextArrow);
    }

    editColor=(id)=>()=>{
        this.props.openUpdateColorDialog(id);
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
                <UpdateColor modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateColor>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_COLOR")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>      
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                        
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("COLOR_NAME")}</SortHeading>
                                <th>{i18n.t("COLOR_CODE")}</th>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingColors?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.colors.length>0 ? this.props.colors.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td>{value.name}</td>
                                                <td><label style={{'background': value.code}} className="badge">{value.code}</label></td>
                                                <td>{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td>
                                                    <button className="btn btn-warning" onClick={this.editColor(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteColor(value._id)}><FontAwesomeIcon icon="eraser" /></button>
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
        colors: state.manageColor.colors,
        isLoadingColors: state.manageColor.isLoadingColors,
        modalIsOpen: state.manageColor.modalIsOpen,
        isEdit: state.manageColor.isEdit,
        fixOpen: state.manageColor.fixOpen,
        redirectToLogin: state.manageColor.redirectToLogin,
        currentPage: state.manageColor.currentPage,
        totalPage: state.manageColor.totalPage,
        totalItemCount: state.manageColor.totalItemCount,
        orderBy: state.manageColor.orderBy,
        sort: state.manageColor.sort,
        search: state.manageColor.search,
        currentArrow: state.manageColor.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getColors: (page, search, orderBy, sort, currentArrow) => dispatch(getColors(page, search, orderBy, sort, currentArrow)),
        openUpdateColorDialog: (id) => dispatch(openUpdateColorDialog(id)),
        deleteColorDispatch: (id) => dispatch(deleteColorDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageColor')(connect(mapStateToProps, mapDispatchToProps)(ManageColor));