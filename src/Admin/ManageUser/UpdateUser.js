import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createUser, updateUserDispatch} from '../../Store/Actions/manageUserAction';
import {connect} from 'react-redux';
import Common from '../../Consts/Common';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class UpdateUser extends Component{
    fileInput=null;
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'userName', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'userName', method: 'isLength', args: [{min: 8, max: 65}], validWhen: true, message: i18n.t("VALIDATE_PASSWORD")},
            { field: 'password', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'password', method: 'isLength', args: [{min: 8, max: 65}], validWhen: true, message: i18n.t("VALIDATE_PASSWORD")},
            { field: 'repassword', method: 'equals', comparison: 'password', validWhen: true, message: i18n.t("VALIDATE_MATCH_PASSWORD")},           
            { field: 'email', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'email', method: 'isEmail', validWhen: true, message: i18n.t("VALIDATE_EMAIL")},
            { field: 'firstName', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'lastName', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")}
        ]);

        this.state={
            user: {
                image: null,
                userName: "",
                password: "",
                repassword: "",
                email: "",
                firstName: "",
                lastName: ""
            },
            imageSrc: selectImg,
            validation: this.validator.reset()
        };
        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.triggerInputFile=this.triggerInputFile.bind(this);
        this.addUser=this.addUser.bind(this);
        this.updateUser=this.updateUser.bind(this);
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
                    user: {...this.state.user, image: file}
                });
              }.bind(this);
        }
        else{
            this.setState({user: {...this.state.user, [e.target.name]: e.target.value}});
            const validation = this.validator.validate({...this.state.user, [e.target.name]: e.target.value}, e.target.name);
            this.setState({ validation });
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.user){
            this.setState({
                user: {
                    userName: nextProps.user.userName,
                    password: "",
                    repassword: "",
                    email: nextProps.user.email,
                    firstName: nextProps.user.firstName,
                    lastName: nextProps.user.lastName,
                    _id: nextProps.user._id
                },
                imageSrc: nextProps.user.image?Common.imgUrl+nextProps.user.image:selectImg,
                validation: this.validator.reset()
            });
        }
    }
    triggerInputFile(){ 
        this.fileInput.click();
    }
    addUser(e){
        e.preventDefault();
        const validation = this.validator.validate(this.state.user);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createUser(this.state.user);
        }
    }
    updateUser(e){
        e.preventDefault();
        this.props.updateUserDispatch(this.state.user);
    }
    render(){
        let validation = this.state.validation;
        return(
            <Modal user={this.props.user} header={!this.props.isEdit?i18n.t("ADD_NEW_USER"):i18n.t("UPDATE_USER")} modalIsOpen={this.props.modalIsOpen} width="450">
                <form>
                    <div className="row container display-block">
                        <div className="form-group row display-block text-center">
                            <img title={i18n.t("CHOOSE_IMAGE")} className="avatar-img" src={this.state.imageSrc} onClick={this.triggerInputFile}/>
                            <input accept="image/x-png,image/gif,image/jpeg" ref={fileInput=>this.fileInput=fileInput} onChange={this.handleChangeValue} name="image" className="hidden" type="file"/>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("USER_NAME")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.userName.isInvalid?'has-error form-control':'form-control'} disabled={this.props.isEdit} onChange={this.handleChangeValue} value={this.state.user.userName} name="userName" type="text" placeholder={i18n.t("USER_NAME")}/>
                                {validation.userName.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.userName.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("PASSWORD")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.password.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.password} name="password" type="password" placeholder={i18n.t("PASSWORD")}/>
                                {validation.password.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.password.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("CONFIRM_PASSWORD")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.repassword.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.repassword} name="repassword" type="password" placeholder={i18n.t("CONFIRM_PASSWORD")}/>
                                {validation.repassword.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.repassword.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("EMAIL")}</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.email.isInvalid?'has-error form-control':'form-control'} disabled={this.props.isEdit} onChange={this.handleChangeValue} value={this.state.user.email} name="email" type="text" placeholder={i18n.t("EMAIL")}/>
                                {validation.email.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.email.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">{i18n.t("FULL_NAME")}</label>
                            </div>
                            <div className="col-4">
                                <input className={validation.firstName.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.firstName} name="firstName" type="text" placeholder={i18n.t("FIRST_NAME")}/>
                                {validation.firstName.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.firstName.message}
                                    </li>
                                </ul>}
                            </div>
                            <div className="col-4">
                                <input className={validation.lastName.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.lastName} name="lastName" type="text" placeholder={i18n.t("LAST_NAME")}/>
                                {validation.lastName.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.lastName.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            !this.props.isEdit?<button className="btn btn-success" onClick={this.addUser}>{i18n.t("ADD_ITEM")}</button>:
                            <button className="btn btn-warning" onClick={this.updateUser}>{i18n.t("UPDATE")}</button>
                        }
                    </div>
                </form>
            </Modal>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        user: state.manageUser.user
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (user) => dispatch(createUser(user)),
        updateUserDispatch: (user) => dispatch(updateUserDispatch(user))
    }
}

export default withNamespaces('updateUser')(connect(mapStateToProps, mapDispatchToProps)(UpdateUser));