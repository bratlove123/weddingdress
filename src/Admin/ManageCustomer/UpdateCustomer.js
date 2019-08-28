import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createCustomer, updateCustomerDispatch} from '../../Store/Actions/manageCustomerAction';
import {connect} from 'react-redux';
import Common from '../../Consts/Common';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import DateTimePicker from 'react-datetime-picker';

class UpdateCustomer extends Component{
    fileInput=null;
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")}
        ]);

        this.state={
            customer: {
                image: null,
                name: '',
                email: '',
                birthday: '',
                sex: '',
                address: '',
                phone: '',
                facebook: '',
                point: '',
                customerGroupId: ''
            },
            imageSrc: selectImg,
            validation: this.validator.reset()
        };
        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.triggerInputFile=this.triggerInputFile.bind(this);
        this.addCustomer=this.addCustomer.bind(this);
        this.updateCustomer=this.updateCustomer.bind(this);
        this.handleChangeDate=this.handleChangeDate.bind(this);
        this.setRadio=this.setRadio.bind(this);
    }

    setRadio=(val)=>()=>{
        this.setState({
            customer: {...this.state.customer, sex: val}
        });
    }

    handleChangeDate(e){
        this.setState({
            customer: {...this.state.customer, birthday: e}
        });
    }

    handleChangeValue(e){
        if(typeof e.getMonth === 'function'){
            this.setState({
                customer: {...this.state.customer, birthday: e}
            });
        }
        else if(e.target.type==="file"){
            var file = this.fileInput.files[0];
            var reader = new FileReader();
            var url = reader.readAsDataURL(file);
            var image = e.target.name;
             reader.onloadend = function (e) {
                this.setState({
                    imageSrc: [reader.result],
                    customer: {...this.state.customer, image: file}
                });
              }.bind(this);
        }
        else{
            this.setState({customer: {...this.state.customer, [e.target.name]: e.target.value}});
            const validation = this.validator.validate({...this.state.customer, [e.target.name]: e.target.value}, e.target.name);
            this.setState({ validation });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.customer){
            this.setState({
                customer: {
                    _id: nextProps.customer._id,
                    name: nextProps.customer.name,
                    email:  nextProps.customer.email,
                    birthday: nextProps.customer.birthday,
                    sex: nextProps.customer.sex?"true":"false",
                    address: nextProps.customer.address,
                    phone: nextProps.customer.phone,
                    facebook: nextProps.customer.facebook,
                    point: nextProps.customer.point,
                    customerGroupId: nextProps.customer.customerGroupId
                },
                imageSrc: nextProps.customer.image?Common.imgUrl+nextProps.customer.image:selectImg,
                validation: this.validator.reset()
            });
        }
    }
    triggerInputFile(){ 
        this.fileInput.click();
    }
    addCustomer(e){
        e.preventDefault();
        const validation = this.validator.validate(this.state.customer);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createCustomer(this.state.customer);
        }
    }
    updateCustomer(e){
        e.preventDefault();
        this.props.updateCustomerDispatch(this.state.customer);
    }
    render(){
        let validation = this.state.validation;
        return(
            <Modal customer={this.props.customer} header={!this.props.isEdit?i18n.t("ADD_NEW_CUSTOMER"):i18n.t("UPDATE_CUSTOMER")} modalIsOpen={this.props.modalIsOpen} width="550">
                <form>
                    <div className="row container display-block">
                        <div className="form-group row display-block text-center">
                            <img title={i18n.t("CHOOSE_IMAGE")} className="avatar-img" src={this.state.imageSrc} onClick={this.triggerInputFile}/>
                            <input accept="image/x-png,image/gif,image/jpeg" ref={fileInput=>this.fileInput=fileInput} onChange={this.handleChangeValue} name="image" className="hidden" type="file"/>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_NAME")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.name.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.customer.name} name="name" type="text" placeholder={i18n.t("CUS_NAME")}/>
                                {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.name.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_BIRTHDAY")}</label>
                            </div>
                            <div className="col-8">
                                <DateTimePicker
                                format="dd/MM/yyyy"
                                 onChange={this.handleChangeDate} 
                                 value={this.state.customer.birthday} name="birthday"
                                />

                                <div className="radio-group">
                                    <div className="radio">
                                        <input onChange={this.setRadio("true")} type="radio" name="sex" checked={this.state.customer.sex==="true"}/>
                                        <label onClick={this.setRadio("true")}>
                                            {i18n.t("MALE")}
                                        </label>
                                    </div>
                                    <div className="radio">
                                        <input onChange={this.setRadio("false")} type="radio" name="sex" checked={this.state.customer.sex==="false"}/>
                                        <label onClick={this.setRadio("false")}>
                                            {i18n.t("FEMALE")}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_ADDRESS")}</label>
                            </div>
                            <div className="col-8">
                            <input className="form-control" onChange={this.handleChangeValue} value={this.state.customer.address} name="address" type="text" placeholder={i18n.t("CUS_ADDRESS")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_PHONE")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.customer.phone} name="phone" type="text" placeholder={i18n.t("CUS_PHONE")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_FACEBOOK")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.customer.facebook} name="facebook" type="text" placeholder={i18n.t("CUS_FACEBOOK")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_GROUP_CUSTOMER")}</label>
                            </div>
                            <div className="col-8">
                            <select className="form-control" 
                                autoComplete="off" 
                                onChange={this.handleChangeValue} 
                                value={this.state.customer.customerGroupId} 
                                name="customerGroupId" type="text">
                                    <option value="" disabled>{i18n.t("SELECT")}</option>
                                    {this.props.customerGroups.map((value)=>{
                                        return(
                                            <option value={value._id} key={value._id}>{value.title}</option>
                                        )
                                        })
                                    }
                            </select>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_POINT")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.customer.point} name="point" type="number" placeholder={i18n.t("CUS_POINT")}/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            !this.props.isEdit?<button className="btn btn-success" onClick={this.addCustomer}>{i18n.t("ADD_ITEM")}</button>:
                            <button className="btn btn-warning" onClick={this.updateCustomer}>{i18n.t("UPDATE")}</button>
                        }
                    </div>
                </form>
            </Modal>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        customer: state.manageCustomer.customer,
        customerGroups: state.manageCustomer.customerGroups
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createCustomer: (customer) => dispatch(createCustomer(customer)),
        updateCustomerDispatch: (customer) => dispatch(updateCustomerDispatch(customer))
    }
}

export default withNamespaces('updateCustomer')(connect(mapStateToProps, mapDispatchToProps)(UpdateCustomer));