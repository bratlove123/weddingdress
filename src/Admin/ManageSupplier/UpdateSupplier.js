import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createSupplier, updateSupplierDispatch} from '../../Store/Actions/manageSupplierAction';
import {connect} from 'react-redux';
import Common from '../../Consts/Common';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class UpdateSupplier extends Component{
    fileInput=null;
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'email', method: 'isEmail', validWhen: true, message: i18n.t("VALIDATE_EMAIL")}
        ]);

        this.state={
            supplier: {
                image: null,
                name: '',
                email: '',
                phone: '',
                address: '',
                facebook: ''
            },
            imageSrc: selectImg,
            validation: this.validator.reset()
        };
        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.triggerInputFile=this.triggerInputFile.bind(this);
        this.addSupplier=this.addSupplier.bind(this);
        this.updateSupplier=this.updateSupplier.bind(this);
    }

    handleChangeValue(e){
        if(e.target.type==="file"){
            var file = this.fileInput.files[0];
            var reader = new FileReader();
            var url = reader.readAsDataURL(file);
            var image = e.target.name;
             reader.onloadend = function (e) {
                this.setState({
                    imageSrc: [reader.result],
                    supplier: {...this.state.supplier, image: file}
                });
              }.bind(this);
        }
        else{
            this.setState({supplier: {...this.state.supplier, [e.target.name]: e.target.value}});
            const validation = this.validator.validate({...this.state.supplier, [e.target.name]: e.target.value}, e.target.name);
            this.setState({ validation });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.supplier){
            this.setState({
                supplier: {
                    _id: nextProps.supplier._id,
                    name: nextProps.supplier.name,
                    email: nextProps.supplier.email,
                    phone: nextProps.supplier.phone,
                    address: nextProps.supplier.address,
                    facebook: nextProps.supplier.facebook
                },
                imageSrc: nextProps.supplier.image?Common.imgUrl+nextProps.supplier.image:selectImg,
                validation: this.validator.reset()
            });
        }
    }
    triggerInputFile(){ 
        this.fileInput.click();
    }
    addSupplier(e){
        e.preventDefault();
        const validation = this.validator.validate(this.state.supplier);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createSupplier(this.state.supplier);
        }
    }
    updateSupplier(e){
        e.preventDefault();
        this.props.updateSupplierDispatch(this.state.supplier);
    }
    render(){
        let validation = this.state.validation;
        return(
            <Modal supplier={this.props.supplier} header={!this.props.isEdit?i18n.t("ADD_NEW_SUPPLIER"):i18n.t("UPDATE_SUPPLIER")} modalIsOpen={this.props.modalIsOpen} width="450">
                <form>
                    <div className="row container display-block">
                        <div className="form-group row display-block text-center">
                            <img title={i18n.t("CHOOSE_IMAGE")} className="avatar-img" src={this.state.imageSrc} onClick={this.triggerInputFile}/>
                            <input accept="image/x-png,image/gif,image/jpeg" ref={fileInput=>this.fileInput=fileInput} onChange={this.handleChangeValue} name="image" className="hidden" type="file"/>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("SUPPLIER_NAME")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.name.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.supplier.name} name="name" type="text" placeholder={i18n.t("SUPPLIER_NAME")}/>
                                {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.name.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("SUPPLIER_EMAIL")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.email.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.supplier.email} name="email" type="text" placeholder={i18n.t("SUPPLIER_EMAIL")}/>
                                {validation.email.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.email.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("SUPPLIER_ADDRESS")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.supplier.address} name="address" type="text" placeholder={i18n.t("SUPPLIER_ADDRESS")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("SUPPLIER_PHONE")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.supplier.phone} name="phone" type="text" placeholder={i18n.t("SUPPLIER_PHONE")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("SUPPLIER_FACEBOOK")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.supplier.facebook} name="facebook" type="text" placeholder={i18n.t("SUPPLIER_FACEBOOK")}/>
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer">
                        {
                            !this.props.isEdit?<button className="btn btn-success" onClick={this.addSupplier}>{i18n.t("ADD_ITEM")}</button>:
                            <button className="btn btn-warning" onClick={this.updateSupplier}>{i18n.t("UPDATE")}</button>
                        }
                    </div>
                </form>
            </Modal>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        supplier: state.manageSupplier.supplier
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createSupplier: (user) => dispatch(createSupplier(user)),
        updateSupplierDispatch: (user) => dispatch(updateSupplierDispatch(user))
    }
}

export default withNamespaces('updateSupplier')(connect(mapStateToProps, mapDispatchToProps)(UpdateSupplier));