import React, {Component} from 'react';
import Layout from '../Common/Layout';
import Modal from '../../Common/Modal';
import { Scrollbars } from 'react-custom-scrollbars';
import LeftNavService from '../../Services/LeftNavService';
import AuthenticationService from '../../Services/AuthenticationService';
import ErrorHandlerService from '../../Services/ErrorHandlerService';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import Common from '../../Consts/Common';

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
        this.state = {
            modalIsOpen: false,
            redirectToLogin:false,
            id: 0,
            navName: '',
            navUrl: '',
            iconClass: '',
            isHasBadge: false,
            badgeClass: '',
            badgeNumber: 0,
            childs: [
                {
                    name:'',
                    url: ''
                }
            ],
            isEdit:false,
            leftNavs:[],
            currentPage: 1,
            currentSearch:"",
            currentSort: "",
            currentArrow: -1,
            totalPage: 0,
            totalItemCount: 0
        };
      
        this.openModal = this.openModal.bind(this);
        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.setIsHasBadge=this.setIsHasBadge.bind(this);
        this.addNewItem=this.addNewItem.bind(this);
        this.addNewChildNav=this.addNewChildNav.bind(this);
        this.removeChildNav=this.removeChildNav.bind(this);
        this.toggleRow=this.toggleRow.bind(this);
        this.getLeftNavsItem=this.getLeftNavsItem.bind(this);
        this.editLeftNav=this.editLeftNav.bind(this);
        this.editLeftNavItem=this.editLeftNavItem.bind(this);
        this.pageClick=this.pageClick.bind(this);
        this.handleCurrentSearchChange=this.handleCurrentSearchChange.bind(this);
        this.sortByProperty=this.sortByProperty.bind(this);
    }

    componentDidMount(){
        document.title = "Manage Left Nav";
    }

    deleteLeftNav = (id) => () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure to delete this item.',
            buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    let thiz=this;
                    LeftNavService.deleteLeftNav(id).then((res)=>{
                        toast("Deleted left nav item successfully.", { type: toast.TYPE.SUCCESS });
                        thiz.getLeftNavsItem(Common.pageSize, this.state.currentPage, this.state.currentSort, true, this.state.currentSearch);
                    }).catch(function (error) {
                        ErrorHandlerService.basicErrorHandler(error, function(){
                            thiz.setState({redirectToLogin: true});
                        });
                    });
                }
            },
            {
                label: 'No'
            }
            ]
        })
    };

    openModal() {
        this.setState({
            navName: '',
            navUrl: '',
            iconClass: '',
            isHasBadge: false,
            badgeClass: '',
            badgeNumber: 0,
            childs: [
                {
                    name:'',
                    url: ''
                }
            ],
            modalIsOpen: true,
            isEdit:false
        });
    }
    handleChangeValue(e){
        this.setState({[e.target.name]: e.target.value})
    }
    handleCurrentSearchChange(e){
        this.setState({currentSearch: e.target.value});
        this.getLeftNavsItem(Common.pageSize, 1, this.state.currentSort, true, e.target.value);
    }
    setIsHasBadge(){
        this.setState({
            isHasBadge: !this.state.isHasBadge
        });
    }
    handleChildsChange = (idx, field) => (evt) => {
        const newChilds = this.state.childs.map((child, sidx) => {
            if (idx !== sidx) return child;
            if(field=='name'){
                return { ...child, name: evt.target.value };
            }
            else{
                return { ...child, url: evt.target.value };
            }
            
        });

        this.setState({ childs: newChilds });
    }
    addNewChildNav(){
        this.setState({childs: this.state.childs.concat({name:'', url: ''})});
    }
    removeChildNav=(id)=>()=>{
         this.setState({childs: this.state.childs.filter((s, sidx)=>id!==sidx)});
    }
    addNewItem(){
        let thiz=this;
        LeftNavService.addLeftNav({
            name: thiz.state.navName,
            url: thiz.state.navUrl,
            iconClass: thiz.state.iconClass,
            isHasBadge: thiz.state.isHasBadge,
            badgeClass: thiz.state.badgeClass,
            badgeNumber: thiz.state.badgeNumber,
            childs:thiz.state.childs
        }).then((res)=>{
            toast("Added left nav item successfully.", { type: toast.TYPE.SUCCESS });
            thiz.setState({modalIsOpen:false});
            thiz.getLeftNavsItem(Common.pageSize, this.state.currentPage, this.state.currentSort, true, this.state.currentSearch);
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                thiz.setState({redirectToLogin: true});
            });
        });
    }

    componentWillMount(){
        this.getLeftNavsItem(Common.pageSize, this.state.currentPage, this.state.currentSort, true, this.state.currentSearch);
    }

    getLeftNavsItem(pageSize, pageNumber, orderBy, sort, search){
        let thiz=this;
        LeftNavService.getLeftNavsWithSorting({
            pageSize: pageSize,
            pageNumber: pageNumber,
            orderBy: orderBy,
            sort: sort,
            search: search
        }).then((res)=>{
            if(res.data){
                thiz.setState({
                    leftNavs: res.data.data,
                    totalItemCount: res.data.countAll,
                    totalPage: Math.ceil(res.data.countAll/Common.pageSize),
                    currentPage: pageNumber
                });
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                thiz.setState({redirectToLogin: true});
            });
        });
    }

    editLeftNav=(id)=>()=>{
        let thiz=this;
        LeftNavService.getLeftNav(id).then((res)=>{
            if(res.data){
                let leftNav=res.data;
                thiz.setState({
                    id: leftNav.id,
                    navName: leftNav.name,
                    navUrl: leftNav.url,
                    iconClass: leftNav.iconClass,
                    isHasBadge: leftNav.isHasBadge,
                    badgeClass: leftNav.badgeClass,
                    badgeNumber: leftNav.badgeNumber,
                    childs: leftNav.childs,
                    modalIsOpen: true,
                    isEdit:true
                });
            }
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                thiz.setState({redirectToLogin: true});
            });
        });
    }

    editLeftNavItem(){
        let thiz=this;
        LeftNavService.editLeftNav({
            id:thiz.state.id,
            name: thiz.state.navName,
            url: thiz.state.navUrl,
            iconClass: thiz.state.iconClass,
            isHasBadge: thiz.state.isHasBadge,
            badgeClass: thiz.state.badgeClass,
            badgeNumber: thiz.state.badgeNumber,
            childs:thiz.state.childs
        }).then((res)=>{
            toast("Updated left nav item successfully.", { type: toast.TYPE.SUCCESS });
            thiz.setState({modalIsOpen:false});
            thiz.getLeftNavsItem(Common.pageSize, this.state.currentPage, this.state.currentSort, true, this.state.currentSearch);
        }).catch(function (error) {
            ErrorHandlerService.basicErrorHandler(error, function(){
                thiz.setState({redirectToLogin: true});
            });
        });
    }

    toggleRow=(i)=>()=>{
        const leftNavs = this.state.leftNavs.map((child, sidx) => {
            if (sidx !== i) return child;
            child.isExpand=!child.isExpand;
            return child;
        });

        this.setState({leftNavs:leftNavs});
    }

    pageClick=(page)=>()=>{
        if(page=='prev'){
            page=this.state.currentPage-1;
        }
        if(page=='next'){
            page=this.state.currentPage+1;
        }
        this.getLeftNavsItem(Common.pageSize, page, this.state.currentSort, true, this.state.currentSearch);
    }

    sortByProperty=(name)=>()=>{
        let thiz=this;
        if(name!=thiz.state.currentSort){
            thiz.setState({
                currentSort: name,
                currentArrow: 0
            });

            thiz.getLeftNavsItem(Common.pageSize, thiz.state.currentPage, name, true, thiz.state.currentSearch);
        }
        else{
            switch(thiz.state.currentArrow){
                case -1:
                    thiz.setState({
                        currentArrow:0
                    });
                    thiz.getLeftNavsItem(Common.pageSize, thiz.state.currentPage, name, true, thiz.state.currentSearch);
                    break;
                case 0:
                    thiz.setState({
                        currentArrow:1
                    });
                    thiz.getLeftNavsItem(Common.pageSize, thiz.state.currentPage, name, false, thiz.state.currentSearch);
                    break;
                case 1:
                    thiz.setState({
                        currentArrow:-1
                    });
                    thiz.getLeftNavsItem(Common.pageSize, thiz.state.currentPage, "ID", true, thiz.state.currentSearch);
                    break;
            }
        }
    }

    renderSortHeader(name){
        let htmlSort = <FontAwesomeIcon icon="arrows-alt-v" />;
        if(this.state.currentSort==name){
            switch(this.state.currentArrow){
                case -1:
                    htmlSort=<FontAwesomeIcon icon="arrows-alt-v" />;
                    break;
                case 0:
                    htmlSort=<FontAwesomeIcon icon="long-arrow-alt-down" />;
                    break;
                case 1:
                    htmlSort=<FontAwesomeIcon icon="long-arrow-alt-up" />;
                    break;
            }
        }
        return htmlSort;
    }

    render(){
        if(this.state.redirectToLogin){
            return <Redirect to={{
                pathname: '/admin/login',
                state: { currentUrl: this.props.location.pathname }
            }} />;
        }

        return(
            <Layout breadcrumb={this.breadcrumb}>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.openModal}>Add New Nav</button>
                        <input onChange={this.handleCurrentSearchChange} value={this.state.currentSearch} name="currentSearch" className="form-control search-box" placeholder="Search" />
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th className="sorting-header" onClick={this.sortByProperty('Name')}> Nav Name {this.renderSortHeader("Name")}</th>
                                <th className="sorting-header" onClick={this.sortByProperty('Url')}> Nav Url {this.renderSortHeader("Url")}</th>
                                <th> Icon Class </th>
                                <th> Is Has Badge </th>
                                <th> Badge Class </th>
                                <th> BadgeNumber </th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.leftNavs.map((value, i)=>{
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
                                                <td className="text-center">
                                                    <button className="btn btn-warning" onClick={this.editLeftNav(value.id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteLeftNav(value.id)}><FontAwesomeIcon icon="eraser" /></button>
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
                                                                <td className="text-center">
                                                                    <button className="btn btn-warning"><FontAwesomeIcon icon="pencil-alt" /></button>
                                                                    <button className="btn btn-danger fix-eraser-btn"><FontAwesomeIcon icon="eraser" /></button>
                                                                </td>
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
                    <div className="row">
                        <div className="col-sm-12 col-md-5">
                            <div className="dataTables_info">Showing {(this.state.currentPage-1)*Common.pageSize+1} to {this.state.currentPage==this.state.totalPage?this.state.totalItemCount:(this.state.currentPage-1)*Common.pageSize+Common.pageSize} of {this.state.totalItemCount} entries</div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                            <div className="dataTables_paginate paging_simple_numbers">
                                <ul className="pagination">
                                    <li className={this.state.currentPage==1?"paginate_button page-item previous disabled":"paginate_button page-item previous"}>
                                        <a href="javascript:void(0)" onClick={this.pageClick(1)} className="page-link">First</a>
                                    </li>
                                    <li className={this.state.currentPage==1?"paginate_button page-item previous disabled":"paginate_button page-item previous"}>
                                        <a href="javascript:void(0)" onClick={this.pageClick('prev')} className="page-link">Previous</a>
                                    </li>
                                    {
                                        Array.from(Array(this.state.totalPage), (e, i) => {
                                            return (
                                                <li  className={i+1==this.state.currentPage?"paginate_button page-item active":"paginate_button page-item"} key={i}>
                                                    <a href="javascript:void(0)" onClick={this.pageClick(i+1)} className="page-link">{i+1}</a>
                                                </li>
                                            );
                                        })
                                    }
                                    <li className={this.state.currentPage==this.state.totalPage?"paginate_button page-item next disabled":"paginate_button page-item next"}>
                                        <a href="javascript:void(0)" onClick={this.pageClick('next')} className="page-link">Next</a>
                                    </li>
                                    <li className={this.state.currentPage==this.state.totalPage?"paginate_button page-item next disabled":"paginate_button page-item next"}>
                                        <a href="javascript:void(0)" onClick={this.pageClick(this.state.totalPage)} className="page-link">Last</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal header={!this.state.isEdit?"Add Left Nav":"Edit Left Nav"} modalIsOpen={this.state.modalIsOpen} width="700">
                    <Scrollbars autoHeight autoHeightMin={500} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                        <div className="row fix-scroll">
                            <div className="col-6">
                                <div className="form-group m-b-20 row">
                                    <div className="col-12">
                                        <label>Nav name</label>
                                        <input onChange={this.handleChangeValue} value={this.state.navName} name="navName" className="form-control" type="text" placeholder="Enter nav name"/>
                                    </div>
                                </div>

                                <div className="form-group row m-b-20">
                                    <div className="col-12">
                                        <label>Nav URL</label>
                                        <input onChange={this.handleChangeValue} value={this.state.navUrl} name="navUrl" className="form-control" type="text" placeholder="Enter nav url"/>
                                    </div>
                                </div>

                                <div className="form-group row m-b-20">
                                    <div className="col-12">
                                        <label>Icon class</label>
                                        <input onChange={this.handleChangeValue} value={this.state.iconClass} name="iconClass" className="form-control" type="text" placeholder="Enter icon class"/>
                                    </div>
                                </div>

                                <div className="form-group row m-b-20">
                                    <div className="col-12">
                                        <div className="checkbox checkbox-custom">
                                            <input type="checkbox" name="isHasBadge" checked={this.state.isHasBadge} />
                                            <label onClick={this.setIsHasBadge}>
                                                Is Has Badge
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.isHasBadge&&<div className="row col-12">
                                        <div className="col-6">
                                            <input onChange={this.handleChangeValue} value={this.state.badgeClass} name="badgeClass" className="form-control" type="text" placeholder="Badge class"/>
                                        </div>
                                        <div className="col-6">
                                            <input onChange={this.handleChangeValue} value={this.state.badgeNumber} name="badgeNumber" className="form-control" type="text" placeholder="Badge number"/>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                            <div className="col-6">
                                
                                {!this.state.isHasBadge&&<div className="form-group row m-b-20">
                                    <div className="col-12 image-urls">
                                        <label>Childs</label>
                                        <div className="nav-childs">
                                            {
                                                this.state.childs.map((item, i) => {        
                                                    return (
                                                        <div className="nav-child-item row" key={i}>
                                                            <div className="col-10">
                                                                <input onChange={this.handleChildsChange(i, 'name')} value={item.name} className="form-control" type="text" placeholder="Enter child name"/>
                                                                <br/>
                                                                <input onChange={this.handleChildsChange(i, 'url')} value={item.url} className="form-control" type="text" placeholder="Enter child url"/>
                                                            </div>
                                                            <div className="col-2 margin-auto">
                                                                <button onClick={this.removeChildNav(i)} className="btn btn-danger">-</button>
                                                            </div>
                                                        </div>
                                                    ) 
                                                })
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12 btn-add-url">
                                        <button onClick={this.addNewChildNav} className="btn btn-primary">Add more child</button>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </Scrollbars>
                    
                    <div className="modal-footer">
                        {
                            !this.state.isEdit?<button onClick={this.addNewItem} className="btn btn-success">Add new item</button>:
                            <button onClick={this.editLeftNavItem} className="btn btn-warning">Update</button>
                        }
                    </div>
                </Modal>
            </Layout>
        );
    }
}

export default ManageLeftNav;