import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createCustomerGroup, updateCustomerGroupDispatch} from '../../Store/Actions/manageCustomerGroupAction';
import {connect} from 'react-redux';
import Common from '../../Consts/Common';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class UpdateCustomerGroup extends Component{
    fileInput=null;
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'title', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'level', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'targetPoint', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'minMoney', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'discount', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")}
        ]);

        this.state={
            customerGroup: {
                image: null,
                title: '',
                level: '',
                targetPoint: '',
                minMoney: '',
                discount: '',
                description: ''
            },
            imageSrc: selectImg,
            validation: this.validator.reset()
        };
        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.triggerInputFile=this.triggerInputFile.bind(this);
        this.addCustomerGroup=this.addCustomerGroup.bind(this);
        this.updateCustomerGroup=this.updateCustomerGroup.bind(this);
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
                    customerGroup: {...this.state.customerGroup, image: file}
                });
              }.bind(this);
        }
        else{
            this.setState({customerGroup: {...this.state.customerGroup, [e.target.name]: e.target.value}});
            const validation = this.validator.validate({...this.state.customerGroup, [e.target.name]: e.target.value}, e.target.name);
            this.setState({ validation });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.customerGroup){
            this.setState({
                customerGroup: {
                    _id: nextProps.customerGroup._id,
                    title: nextProps.customerGroup.title,
                    level: nextProps.customerGroup.level,
                    targetPoint: nextProps.customerGroup.targetPoint,
                    minMoney: nextProps.customerGroup.minMoney,
                    discount: nextProps.customerGroup.discount,
                    description: nextProps.customerGroup.description
                },
                imageSrc: nextProps.customerGroup.image?Common.imgUrl+nextProps.customerGroup.image:selectImg,
                validation: this.validator.reset()
            });
        }
    }
    triggerInputFile(){ 
        this.fileInput.click();
    }
    addCustomerGroup(e){
        e.preventDefault();
        const validation = this.validator.validate(this.state.customerGroup);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createCustomerGroup(this.state.customerGroup);
        }
    }
    updateCustomerGroup(e){
        e.preventDefault();
        this.props.updateCustomerGroupDispatch(this.state.customerGroup);
    }
    render(){
        let validation = this.state.validation;
        return(
            <Modal customerGroup={this.props.customerGroup} header={!this.props.isEdit?i18n.t("ADD_NEW_CUSTOMER_GROUP"):i18n.t("UPDATE_CUS_GROUP")} modalIsOpen={this.props.modalIsOpen} width="450">
                <form>
                    <div className="row container display-block">
                        <div className="form-group row display-block text-center">
                            <img title={i18n.t("CHOOSE_IMAGE")} className="avatar-img" src={this.state.imageSrc} onClick={this.triggerInputFile}/>
                            <input accept="image/x-png,image/gif,image/jpeg" ref={fileInput=>this.fileInput=fileInput} onChange={this.handleChangeValue} name="image" className="hidden" type="file"/>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_GROUP_TITLE")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.title.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.customerGroup.title} name="title" type="text" placeholder={i18n.t("CUS_GROUP_TITLE")}/>
                                {validation.title.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.title.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_GROUP_LEVEL")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.level.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.customerGroup.level} name="level" type="number" placeholder={i18n.t("CUS_GROUP_LEVEL")}/>
                                {validation.level.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.level.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_GROUP_TARGET_POINT")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.customerGroup.targetPoint} name="targetPoint" type="number" placeholder={i18n.t("CUS_GROUP_TARGET_POINT")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_GROUP_MIN_MONEY")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.customerGroup.minMoney} name="minMoney" type="number" placeholder={i18n.t("CUS_GROUP_MIN_MONEY")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CUS_GROUP_DISCOUNT")}</label>
                            </div>
                            <div className="col-8">
                                <input className='form-control' onChange={this.handleChangeValue} value={this.state.customerGroup.discount} name="discount" type="number" placeholder={i18n.t("CUS_GROUP_DISCOUNT")}/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("DESCRIPTION")}</label>
                            </div>
                            <div className="col-8">
                                <textarea className='form-control' 
                                onChange={this.handleChangeValue} 
                                value={this.state.customerGroup.description} name="description" 
                                placeholder={i18n.t("DESCRIPTION")}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            !this.props.isEdit?<button className="btn btn-success" onClick={this.addCustomerGroup}>{i18n.t("ADD_ITEM")}</button>:
                            <button className="btn btn-warning" onClick={this.updateCustomerGroup}>{i18n.t("UPDATE")}</button>
                        }
                    </div>
                </form>
            </Modal>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        customerGroup: state.manageCustomerGroup.customerGroup
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createCustomerGroup: (customerGroup) => dispatch(createCustomerGroup(customerGroup)),
        updateCustomerGroupDispatch: (customerGroup) => dispatch(updateCustomerGroupDispatch(customerGroup))
    }
}

export default withNamespaces('updateCustomerGroup')(connect(mapStateToProps, mapDispatchToProps)(UpdateCustomerGroup));