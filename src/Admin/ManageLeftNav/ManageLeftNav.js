import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getLeftNavs, openUpdateLeftNavDialog, deleteLeftNavDispatch, resetState} from '../../Store/Actions/manageLeftNavAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateLeftNav from './UpdateLeftNav';

class ManageLeftNav extends Component{
    breadcrumb = [
        {
            name: "Configuration",
            url: ""
        },
        {
            name: "Manage Left Nav",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.toggleRow=this.toggleRow.bind(this);
        this.getLeftNavsItem=this.getLeftNavsItem.bind(this);
        this.editLeftNav=this.editLeftNav.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = "Manage Left Nav";
    }

    toggleRow=(i)=>()=>{
        const leftNavs = this.props.leftNavs.map((child, sidx) => {
            if (sidx !== i) return child;
            child.isExpand=!child.isExpand;
            return child;
        });

        this.setState({leftNavs:leftNavs});
    }

    deleteLeftNav = (id) => () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to delete this item.',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    this.props.deleteLeftNavDispatch(id);
                }
            },
            {
                label: 'No'
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateLeftNavDialog();
    }

    componentWillMount(){
        this.props.getLeftNavs();
    }

    getLeftNavsItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getLeftNavs(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getLeftNavs(undefined, e.target.value);
    }

    changePage(page){
        this.props.getLeftNavs(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getLeftNavs(undefined, undefined, name, isAsc, nextArrow);
    }

    editLeftNav=(id)=>()=>{
        this.props.openUpdateLeftNavDialog(id);
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
                <UpdateLeftNav modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateLeftNav>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>Add New Nav</button>
                        <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder="Search" />
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th></th>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>Nav Name</SortHeading>
                                <SortHeading name={'url'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>Nav Url</SortHeading>
                                <th> Icon Class </th>
                                <th> Is Has Badge </th>
                                <th> Badge Class </th>
                                <th> BadgeNumber </th>
                                <th>Position</th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingLeftNavs?<tr><td colSpan="8"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.leftNavs.length>0 && this.props.leftNavs.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td onClick={this.toggleRow(i)}>{value.isExpand?<FontAwesomeIcon icon="minus-square" />:<FontAwesomeIcon icon="plus-square" />}</td>
                                                <td onClick={this.toggleRow(i)}>{value.name}</td>
                                                <td><a href={value.url}>{value.url}</a></td>
                                                <td onClick={this.toggleRow(i)} className="text-center"><i className={value.iconClass}></i></td>
                                                <td onClick={this.toggleRow(i)} className="text-center"><span className="badge label-table badge-success">{value.isHasBadge&&<FontAwesomeIcon icon="check" />}</span></td>
                                                <td onClick={this.toggleRow(i)} className="text-center"><span className={"badge label-table badge-"+value.badgeClass}>{value.badgeClass}</span></td>
                                                <td onClick={this.toggleRow(i)} className="text-center">{value.badgeNumber}</td>
                                                <td onClick={this.toggleRow(i)} className="text-center">{value.position}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-warning" onClick={this.editLeftNav(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteLeftNav(value._id)}><FontAwesomeIcon icon="eraser" /></button>
                                                </td>
                                                
                                            </tr>
                                            {
                                                value.childs.length>0&&value.childs[0].name&&value.childs[0].url&&value.isExpand&&<React.Fragment>
                                                {
                                                    value.childs.map((value, i)=>{
                                                        return(
                                                            <tr key={i}>
                                                                <td colSpan="3"></td>
                                                                <td colSpan="2">{value.name}</td>
                                                                <td colSpan="2">{value.url}</td>
                                                                <td>{value.position}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    )
                                })
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
        leftNavs: state.manageLeftNav.leftNavs,
        isLoadingLeftNavs: state.manageLeftNav.isLoadingLeftNavs,
        modalIsOpen: state.manageLeftNav.modalIsOpen,
        isEdit: state.manageLeftNav.isEdit,
        fixOpen: state.manageLeftNav.fixOpen,
        redirectToLogin: state.manageLeftNav.redirectToLogin,
        currentPage: state.manageLeftNav.currentPage,
        totalPage: state.manageLeftNav.totalPage,
        totalItemCount: state.manageLeftNav.totalItemCount,
        orderBy: state.manageLeftNav.orderBy,
        sort: state.manageLeftNav.sort,
        search: state.manageLeftNav.search,
        currentArrow: state.manageLeftNav.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLeftNavs: (page, search, orderBy, sort, currentArrow) => dispatch(getLeftNavs(page, search, orderBy, sort, currentArrow)),
        openUpdateLeftNavDialog: (id) => dispatch(openUpdateLeftNavDialog(id)),
        deleteLeftNavDispatch: (id) => dispatch(deleteLeftNavDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageLeftNav);