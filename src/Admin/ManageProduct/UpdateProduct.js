import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import { Scrollbars } from 'react-custom-scrollbars';
import {createProduct, updateProductDispatch, getTypeById} from '../../Store/Actions/manageProductAction';
import {connect} from 'react-redux';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import ReactTooltip from 'react-tooltip'
import Common from '../../Consts/Common';
import { toast } from 'react-toastify';
import FormatCurrency from '../../Common/FormatCurrency';

class UpdateProduct extends Component{
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'typeId', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'colorId', method: 'isEmpty', parent: 'details', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'price', method: 'isEmpty', parent: 'details', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'ogPrice', method: 'isEmpty', parent: 'details', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'whPrice', method: 'isEmpty', parent: 'details', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")}
        ]);

        this.state = {
            product: {
                _id: 0,
                name: '',
                code: '',
                des: '',
                lookAfter: '',
                brand: '',
                supplierId: '',
                typeId:'',
                details: [
                    {
                        colorId: '',
                        sizes: [
                            {
                                sizeId:'',
                                quantity:''
                            }
                        ],
                        images: [],
                        imgSrcs: [],
                        price: '',
                        ogPrice: '',
                        whPrice: ''
                    }
                ],
                del_arr: [],
                del_size_arr: []
            },
            validation: this.validator.reset()
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handleChildsChange = this.handleChildsChange.bind(this);
        this.addNewChildProduct = this.addNewChildProduct.bind(this);
        this.removeChildProduct = this.removeChildProduct.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.editProductItem = this.editProductItem.bind(this);
    }

    handleChangeValue(e){
        if(e.target.name==='typeId'){
            let product = this.state.product;
            product.typeId = e.target.value;
            this.props.getTypeById(e.target.value, product);
        }
        this.setState({product: {...this.state.product, [e.target.name]: e.target.value}});
        const validation = this.validator.validate({...this.state.product, [e.target.name]: e.target.value}, e.target.name);
        this.setState({ validation });
    }

    handleChildsChange = (idx, field) => (evt) => {
        const newChilds = this.state.product.details.map((child, sidx) => {
            if (idx !== sidx) return child;
            switch(field){
                case 'colorId':
                    let checkColor = this.state.product.details.filter((detail)=>{
                        return detail.colorId === evt.target.value;
                    });
                    if(checkColor.length > 0){
                        toast(i18n.t("DUPLICATE_COLOR"), { type: toast.TYPE.ERROR });
                        return child;
                    }
                    return { ...child, colorId: evt.target.value };
                case 'price': 
                    return { ...child, price: evt.target.value };
                case 'ogPrice':
                    return { ...child, ogPrice: evt.target.value };
                case 'whPrice':
                    return { ...child, whPrice: evt.target.value };
                case 'images':
                    let files = [];
                    let imgs = [];
                    for(let k=0;k<evt.target.files.length;k++){
                        files.push(evt.target.files[k]);
                        imgs.push(URL.createObjectURL(evt.target.files[k]));
                    }
                    
                    return { ...child, imgSrcs: imgs, images: files };
            }
        });

        this.setState({ product: {...this.state.product, details: newChilds} });
        const validation = this.validator.validate({...this.state.product, details: newChilds}, {field: field, id: idx});
        this.setState({ validation });
    }

    handleSizesChange=(idx, sizeIdx, field) => (evt) => {
        const newSizes = this.state.product.details[idx].sizes.map((size, sizeIdxx) => {
            if (sizeIdxx !== sizeIdx) return size;
            switch(field){
                case 'sizeId':
                    let checkSize = this.state.product.details[idx].sizes.filter((size)=>{
                        return size.sizeId === evt.target.value;
                    });
                    if(checkSize.length > 0){
                        toast(i18n.t("DUPLICATE_SIZE"), { type: toast.TYPE.ERROR });
                        return size;
                    }
                    return { ...size, sizeId: evt.target.value };
                case 'quantity': 
                    return { ...size, quantity: evt.target.value };
            }
        });

        let newDetails = this.state.product.details;
        newDetails[idx].sizes=newSizes;

        this.setState({ product: {...this.state.product, details: newDetails} });
    }

    addNewChildProduct(e){
        e.preventDefault();
        this.setState({product: {...this.state.product, details: 
            this.state.product.details.concat({
                colorId: '',
                sizes: [
                    {
                        sizeId:'',
                        quantity:''
                    }
                ],
                images: [],
                imgSrcs: [],
                price: '',
                ogPrice: '',
                whPrice: ''
            })}});
    }

    removeChildProduct=(id)=>()=>{
        let thiz=this;
        let newChilds = [...thiz.state.product.details];

        //Remove childs size
        let childsSize = thiz.state.product.details[id].sizes;
        let delSizeArr = [];
        childsSize.map((child)=>{
            if(child._id){
                delSizeArr.push(child._id);
            }
        });

        newChilds = newChilds.filter((s, sidx)=>id!==sidx);
        let newDellArr = [];
        if(thiz.state.product.details[id]._id){
            newDellArr = [...thiz.state.product.del_arr, thiz.state.product.details[id]._id];
        }
        thiz.setState({product: {...thiz.state.product, details: newChilds, del_arr: newDellArr, del_size_arr: delSizeArr}});
    }

    addNewSize=(index)=>()=>{
        let newDetails = this.state.product.details;
        newDetails[index].sizes = newDetails[index].sizes.concat( {
            sizeId:'',
            quantity:''
        });
        this.setState({product: {...this.state.product, details: newDetails}})
    }

    removeSize=(i, sizeIdx)=>()=>{
        let newDetails = this.state.product.details;
        let newDelSizes = this.state.product.del_size_arr;
        if(newDetails[i].sizes[sizeIdx]._id){
            newDelSizes.push(newDetails[i].sizes[sizeIdx]._id);
        }
        newDetails[i].sizes = newDetails[i].sizes.filter((s, sidx)=>sizeIdx!==sidx);
        this.setState({product: {...this.state.product, del_size_arr: newDelSizes, details: newDetails}})
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.product){
            this.setState({
                product: {
                    _id: nextProps.product._id,
                    name: nextProps.product.name,
                    code: nextProps.product.url,
                    des: nextProps.product.des,
                    lookAfter: nextProps.product.lookAfter,
                    brand: nextProps.product.brand,
                    typeId: nextProps.product.typeId,
                    supplierId: nextProps.product.supplierId,
                    details: nextProps.product.details,
                    del_arr: nextProps.product.del_arr?nextProps.product.del_arr:[],
                    del_size_arr: nextProps.product.del_size_arr?nextProps.product.del_size_arr:[]
                },
                validation: this.validator.reset()
            });
        }
    }

    addNewItem(e){
        e.preventDefault();
        const validation = this.validator.validate(this.state.product);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createProduct(this.state.product);
        }
    }

    editProductItem(e){
        e.preventDefault();
        const validation = this.validator.validate(this.state.product);
        this.setState({ validation });

        if(validation.isValid){
            this.props.updateProductDispatch(this.state.product);
        }
    }

    render(){
        let validation = this.state.validation;
        return(
        <Modal header={!this.props.isEdit?i18n.t("ADD_NEW_PRODUCT"):i18n.t("EDIT_PRODUCT")} modalIsOpen={this.props.modalIsOpen} width="1450">
            <ReactTooltip place="top" effect="solid"/>
            <form>
                <Scrollbars autoHeight autoHeightMin={500} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                    <div className="row fix-scroll">
                        <div className="col-3">
                            <div className="form-group m-b-20 row">
                                <div className="col-12">
                                    <label>{i18n.t("PRODUCT_NAME")}</label>
                                    <input className={validation.name.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.product.name} name="name" type="text" placeholder={i18n.t("PRODUCT_NAME")}/>
                                    {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.name.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>{i18n.t("PRODUCT_TYPE")}</label>
                                    <select
                                     className={validation.typeId.isInvalid?'has-error form-control':'form-control'}
                                    autoComplete="off" 
                                    onChange={this.handleChangeValue} 
                                    value={this.state.product.typeId} 
                                    name="typeId" type="text">
                                    <option value="" disabled>{i18n.t("SELECT")}</option>
                                    {this.props.types.map((value)=>{
                                        return(
                                            <option value={value._id} key={value._id}>{value.name}</option>
                                        )
                                        })
                                    }
                                    </select>
                                    {validation.typeId.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.typeId.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>{i18n.t("SUPPLIER")}</label>
                                    <select className="form-control" 
                                    autoComplete="off" 
                                    onChange={this.handleChangeValue} 
                                    value={this.state.product.supplierId} 
                                    name="supplierId" placeholder={i18n.t("SUPPLIER")}>
                                        <option value="" disabled>{i18n.t("SELECT")}</option>
                                        {this.props.suppliers.map((value)=>{
                                            return(
                                                <option value={value._id} key={value._id}>{value.name}</option>
                                            )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>{i18n.t("DESCRIPTION")}</label>
                                    <textarea  className="form-control" autoComplete="off" onChange={this.handleChangeValue} value={this.state.product.des} name="des" type="text" placeholder={i18n.t("DESCRIPTION")}>
                                    </textarea>
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>{i18n.t("LOOK_AFTER")}</label>
                                    <textarea  className="form-control" autoComplete="off" onChange={this.handleChangeValue} value={this.state.product.lookAfter} name="lookAfter" type="text" placeholder={i18n.t("LOOK_AFTER")}>
                                    </textarea>
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>{i18n.t("BRAND")}</label>
                                    <input autoComplete="off" onChange={this.handleChangeValue} value={this.state.product.brand} name="brand" className="form-control" type="text" placeholder={i18n.t("BRAND")}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="form-group row m-b-20">
                                <div className="col-12 image-urls">
                                    <label>{i18n.t("PRODUCT_DETAILS")}</label>
                                    <div className="nav-childs">
                                        {
                                            this.state.product.details.map((item, i) => {        
                                                return (
                                                    <div className="nav-child-item row" key={i}>
                                                        <div className="col-11">
                                                            <div className="row">
                                                                <div className="col-7">
                                                                    <select data-tip={i18n.t("PRODUCT_COLOR")}
                                                                    className={validation.colorIds && validation.colorIds[i] && validation.colorIds[i].isInvalid?'has-error form-control':'form-control'}
                                                                    autoComplete="off" 
                                                                    onChange={this.handleChildsChange(i, 'colorId')} 
                                                                    value={item.colorId} 
                                                                    name="colorId" type="text">
                                                                    <option value="" disabled>{i18n.t("SELECT")}</option>
                                                                    {this.props.colors.map((value)=>{
                                                                        return(
                                                                            <option value={value._id} key={value._id}>{value.name}</option>
                                                                        )
                                                                        })
                                                                    }
                                                                    </select>
                                                                    {validation.colorIds && validation.colorIds[i] && validation.colorIds[i].isInvalid && <ul className="parsley-errors-list filled">
                                                                        <li className="parsley-required">
                                                                            {validation.colorIds[i].message}
                                                                        </li>
                                                                    </ul>}
                                                                    <div className="upload-btn-wrapper">
                                                                        <button className="btn-upload">{item.imgSrcs && item.imgSrcs.length>0?i18n.t("CHANGE_IMAGES"):i18n.t("UPLOAD_IMAGES")}</button>
                                                                        <input accept="image/x-png,image/gif,image/jpeg" type="file" name="myfile" multiple onChange={this.handleChildsChange(i, 'images')} />
                                                                        <div className="preview-img">
                                                                            {
                                                                                item.imgSrcs && item.imgSrcs.length>0 && item.imgSrcs.map((img, imgId)=>{
                                                                                    return(
                                                                                        img.indexOf('blob')>=0?<img src={img} key={imgId} />:<img src={Common.imgUrl+img} key={imgId} />
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            <input data-tip={i18n.t("PRICE")} 
                                                                            className={validation.prices && validation.prices[i] && validation.prices[i].isInvalid?'has-error form-control':'form-control'}
                                                                            autoComplete="off" type="number" onChange={this.handleChildsChange(i, 'price')} value={item.price} placeholder={i18n.t("PRICE")}/>
                                                                            <FormatCurrency price={item.price}></FormatCurrency>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input data-tip={i18n.t("OG_PRICE")} 
                                                                            className={validation.ogPrices && validation.ogPrices[i] && validation.ogPrices[i].isInvalid?'has-error form-control':'form-control'}
                                                                            autoComplete="off" type="number" onChange={this.handleChildsChange(i, 'ogPrice')} value={item.ogPrice} placeholder={i18n.t("OG_PRICE")}/>
                                                                            <FormatCurrency price={item.ogPrice}></FormatCurrency>
                                                                        </div>
                                                                        <div className="col-4">
                                                                            <input data-tip={i18n.t("WH_PRICE")}
                                                                            className={validation.whPrices && validation.whPrices[i] && validation.whPrices[i].isInvalid?'has-error form-control':'form-control'}
                                                                            autoComplete="off" type="number" onChange={this.handleChildsChange(i, 'whPrice')} value={item.whPrice} placeholder={i18n.t("WH_PRICE")}/>
                                                                            <FormatCurrency price={item.whPrice}></FormatCurrency>
                                                                        </div>
                                                                    </div>
                                                                    <a href="javascript:void(0)" onClick={this.addNewSize(i)} className="btn btn-success sub-btn-add"><i className="fi fi-circle-plus"></i> {i18n.t("ADD_SIZE")}</a>
                                                                </div>
                                                                <div className="col-5">
                                                                    <label>{i18n.t("SIZE_DETAILS")}</label>
                                                                    {
                                                                        item.sizes.map((sizeVal, sizeIdx)=>{
                                                                            return(
                                                                                <div key={sizeIdx} className="row size-block">
                                                                                    <div className="col-9">
                                                                                        <select data-tip={i18n.t("PRODUCT_SIZE")} className="form-control" 
                                                                                        autoComplete="off" 
                                                                                        onChange={this.handleSizesChange(i, sizeIdx, 'sizeId')} 
                                                                                        value={sizeVal.sizeId} 
                                                                                        name="sizeId" type="text">
                                                                                            <option value="" disabled>{i18n.t("SELECT")}</option>
                                                                                            {this.props.sizes.map((value)=>{
                                                                                                return(
                                                                                                    <option value={value._id} key={value._id}>{value.name}</option>
                                                                                                )
                                                                                                })
                                                                                            }
                                                                                        </select>
                                                                                        <input data-tip={i18n.t("QUANTITY")} autoComplete="off" type="number" onChange={this.handleSizesChange(i, sizeIdx, 'quantity')} value={sizeVal.quantity} className="form-control" placeholder={i18n.t("QUANTITY")}/>
                                                                                    </div>
                                                                                    <div className="col-3 margin-auto-padding">
                                                                                        <a href="javascript:void(0)" onClick={this.removeSize(i, sizeIdx)} className="btn"><i className="fi fi-circle-minus"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                    
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-1 margin-auto-padding">
                                                            <a className="form-control" href="javascript:void(0)" onClick={this.removeChildProduct(i)} className="btn btn-danger"><i className="fi-cross"></i></a>
                                                        </div>
                                                    </div>
                                                ) 
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="col-12 btn-add-url">
                                    <button onClick={this.addNewChildProduct} className="btn btn-primary">{i18n.t("ADD_MORE_CHILD_PRODUCT_DETAIL")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </Scrollbars>
            
                <div className="modal-footer">
                    {
                        !this.props.isEdit?<button onClick={this.addNewItem} className="btn btn-success">{i18n.t("ADD_ITEM")}</button>:
                        <button onClick={this.editProductItem} className="btn btn-warning">{i18n.t("UPDATE")}</button>
                    }
                </div>
            </form>
        </Modal>)
    }
}

const mapStateToProps=(state)=>{
    return {
        product: state.manageProduct.product,
        colors: state.manageProduct.colors,
        types: state.manageProduct.types,
        suppliers: state.manageProduct.suppliers,
        sizes: state.manageProduct.sizes
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createProduct: (product) => dispatch(createProduct(product)),
        updateProductDispatch: (product) => dispatch(updateProductDispatch(product)),
        getTypeById: (id, product) => dispatch(getTypeById(id, product))
    }
}

export default withNamespaces('updateProduct')(connect(mapStateToProps, mapDispatchToProps)(UpdateProduct));