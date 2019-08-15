import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Redirect } from 'react-router';
import {getProducts, openUpdateProductDialog, deleteProductDispatch, resetState} from '../../Store/Actions/manageProductAction';
import {connect} from 'react-redux';
import Paging from '../../Common/Paging';
import SortHeading from '../../Common/SortHeading';
import ReactLoading from 'react-loading';
import UpdateProduct from './UpdateProduct';
import Moment from 'react-moment';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import noAvatar from '../../assets/images/no_avatar.png';
import Common from '../../Consts/Common';

class ManageProduct extends Component{
    breadcrumb = [
        {
            name: "SETTINGS",
            url: ""
        },
        {
            name: "MANAGE_PRODUCTS",
            url: ""
        }
    ];

    constructor(props){
        super(props);

        this.addNewItem=this.addNewItem.bind(this);
        this.toggleRow=this.toggleRow.bind(this);
        this.getProductsItem=this.getProductsItem.bind(this);
        this.editProduct=this.editProduct.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.changePage=this.changePage.bind(this);
        this.sortChange = this.sortChange.bind(this);
    }

    componentDidMount(){
        document.title = i18n.t("MANAGE_PRODUCTS");
    }

    toggleRow=(i)=>()=>{
        const products = this.props.products.map((child, sidx) => {
            if (sidx !== i) return child;
            child.isExpand=!child.isExpand;
            return child;
        });

        this.setState({products:products});
    }

    deleteProduct = (id) => () => {
        confirmAlert({
            title: i18n.t("DELETE_CONFIRM"),
            message: i18n.t("SURE_DELETE"),
            buttons: [
            {
                label: i18n.t("YES"),
                onClick: () => {
                    this.props.deleteProductDispatch(id);
                }
            },
            {
                label: i18n.t("NO")
            }
            ]
        })
    };

    addNewItem(){
        this.props.openUpdateProductDialog();
    }

    componentWillMount(){
        this.props.getProducts();
    }

    getProductsItem(pageSize, pageNumber, orderBy, sort, search){
        this.props.getProducts(pageSize, pageNumber, orderBy, sort, search)
    }

    handleSearchChange(e){
        this.props.getProducts(undefined, e.target.value);
    }

    changePage(page){
        this.props.getProducts(page);
    }

    sortChange(name, isAsc, nextArrow){
        this.props.getProducts(undefined, undefined, name, isAsc, nextArrow);
    }

    editProduct=(id)=>()=>{
        this.props.openUpdateProductDialog(id);
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
                <UpdateProduct modalIsOpen={this.props.modalIsOpen} isEdit={this.props.isEdit} fixOpen={this.props.fixOpen}></UpdateProduct>
                <div className="card-box table-responsive">
                    <div className="table-header">
                        <button className="btn btn-success" onClick={this.addNewItem}>{i18n.t("ADD_NEW_PRODUCT")}</button>
                        <div className="inner-addon right-addon">
                            <i className="fi fi-search"></i>      
                            <input onChange={this.handleSearchChange} name="currentSearch" className="form-control search-box" placeholder={i18n.t("SEARCH")} />
                        </div>
                        
                    </div>
                    <table className="table table-colored m-b-0 toggle-arrow-tiny fix-table">
                        <thead>
                            <tr>
                                <th></th>
                                <SortHeading name={'code'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("PRODUCT_CODE")}</SortHeading>
                                <SortHeading name={'name'} currentSort={this.props.orderBy} currentArrow={this.props.currentArrow} getDataForSort={this.sortChange}>{i18n.t("PRODUCT_NAME")}</SortHeading>
                                <th> {i18n.t("PRODUCT_TYPE")} </th>
                                <th> {i18n.t("SUPPLIER")} </th>
                                <th> {i18n.t("DESCRIPTION")} </th>
                                <th> {i18n.t("LOOK_AFTER")} </th>
                                <th>{i18n.t("BRAND")}</th>
                                <th> {i18n.t("MODIFIED_BY")} </th>
                                <th>{i18n.t("MODIFIED_ON")}</th>
                                <th> {i18n.t("ACTION")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.props.isLoadingProducts?<tr><td colSpan="10"><div className="loading"><ReactLoading type={'cylon'} color={'#02c0ce'} height={'15px'} /></div></td></tr>:
                                this.props.products.length>0 ? this.props.products.map((value, i)=>{
                                    return (
                                        <React.Fragment key={i}>
                                            <tr className="togglable">
                                                <td onClick={this.toggleRow(i)}>{value.isExpand?<FontAwesomeIcon icon="minus-square" />:<FontAwesomeIcon icon="plus-square" />}</td>
                                                <td onClick={this.toggleRow(i)}>{value.code}</td>
                                                <td onClick={this.toggleRow(i)}>{value.name}</td>
                                                <td onClick={this.toggleRow(i)}>{value.typeId.name}</td>
                                                <td onClick={this.toggleRow(i)}>{value.supplierId.name}</td>
                                                <td onClick={this.toggleRow(i)}>{value.des}</td>
                                                <td onClick={this.toggleRow(i)}>{value.lookAfter}</td>
                                                <td onClick={this.toggleRow(i)}>{value.brand}</td>
                                                <td onClick={this.toggleRow(i)} className="text-center">{value.modifiedBy && value.modifiedBy.userName}</td>
                                                <td onClick={this.toggleRow(i)} className="text-center"><Moment date={value.modifiedOn} format="DD/MM/YYYY"></Moment></td>
                                                <td className="text-center">
                                                    <button className="btn btn-warning" onClick={this.editProduct(value._id)}><FontAwesomeIcon icon="pencil-alt" /></button>
                                                    <button className="btn btn-danger fix-eraser-btn" onClick={this.deleteProduct(value._id)}><FontAwesomeIcon icon="eraser" /></button>
                                                </td>
                                            </tr>
                                            {
                                                value.details.length>0&&value.isExpand&&<React.Fragment>
                                                {
                                                    value.details.map((value, j)=>{
                                                        return(
                                                            <tr key={j}>
                                                                <td colSpan="11">
                                                                    <table className="sub-table">
                                                                        <thead>
                                                                            <tr>
                                                                                <th></th>
                                                                                <th>{i18n.t("PRODUCT_IMAGE")}</th>
                                                                                <th>{i18n.t("PRODUCT_COLOR")}</th>
                                                                                <th>{i18n.t("PRODUCT_SIZE")}</th>
                                                                                <th>{i18n.t("PRICE")}</th>
                                                                                <th>{i18n.t("OG_PRICE")}</th>
                                                                                <th>{i18n.t("WH_PRICE")}</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td></td>
                                                                                <td><img className="list-img" src={value.images[0]?Common.imgUrl+value.images[0]:noAvatar}/></td>
                                                                                <td>{value.colorId.name}</td>
                                                                                <td>{value.sizes.map((v, k)=>{
                                                                                    return(
                                                                                        <div key={k}>
                                                                                            {v.sizeId.name} | {v.quantity}
                                                                                        </div>
                                                                                    )
                                                                                })}</td>
                                                                                <td>{value.price}</td>
                                                                                <td>{value.ogPrice}</td>
                                                                                <td>{value.whPrice}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
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
        products: state.manageProduct.products,
        isLoadingProducts: state.manageProduct.isLoadingProducts,
        modalIsOpen: state.manageProduct.modalIsOpen,
        isEdit: state.manageProduct.isEdit,
        fixOpen: state.manageProduct.fixOpen,
        redirectToLogin: state.manageProduct.redirectToLogin,
        currentPage: state.manageProduct.currentPage,
        totalPage: state.manageProduct.totalPage,
        totalItemCount: state.manageProduct.totalItemCount,
        orderBy: state.manageProduct.orderBy,
        sort: state.manageProduct.sort,
        search: state.manageProduct.search,
        currentArrow: state.manageProduct.currentArrow
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getProducts: (page, search, orderBy, sort, currentArrow) => dispatch(getProducts(page, search, orderBy, sort, currentArrow)),
        openUpdateProductDialog: (id) => dispatch(openUpdateProductDialog(id)),
        deleteProductDispatch: (id) => dispatch(deleteProductDispatch(id)),
        resetState: () => dispatch(resetState())
    }
}

export default withNamespaces('manageProduct')(connect(mapStateToProps, mapDispatchToProps)(ManageProduct));