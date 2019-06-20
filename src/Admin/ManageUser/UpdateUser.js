import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createUser, updateUserDispatch} from '../../Store/Actions/manageUserAction';
import {connect} from 'react-redux';
import Common from '../../Consts/Common';
import FormValidator from '../../Common/FormValidator';

class UpdateUser extends Component{
    fileInput=null;
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'userName', method: 'isEmpty', validWhen: false, message: 'User name is required.'},
            { field: 'userName', method: 'isLength', args: [{min: 8, max: 65}], validWhen: true, message: 'Length must be larger than 8.'},
            { field: 'password', method: 'isEmpty', validWhen: false, message: 'Password is required.'},
            { field: 'password', method: 'isLength', args: [{min: 8, max: 65}], validWhen: true, message: 'Length must be larger than 8.'},
            { field: 'repassword', method: 'equals', comparison: 'password', validWhen: true, message: 'Password does not match.'},           
            { field: 'email', method: 'isEmpty', validWhen: false, message: 'Email is required.'},
            { field: 'email', method: 'isEmail', validWhen: true, message: 'Email not have right format.'},
            { field: 'firstName', method: 'isEmpty', validWhen: false, message: 'First name is required.'},
            { field: 'lastName', method: 'isEmpty', validWhen: false, message: 'Last name is required.'}
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
            <Modal user={this.props.user} header={!this.props.isEdit?"Add New User":"Edit User"} modalIsOpen={this.props.modalIsOpen} width="450">
                <form>
                    <div className="row container display-block">
                        <div className="form-group row display-block text-center">
                            <img title="Choose the image..." className="avatar-img" src={this.state.imageSrc} onClick={this.triggerInputFile}/>
                            <input accept="image/x-png,image/gif,image/jpeg" ref={fileInput=>this.fileInput=fileInput} onChange={this.handleChangeValue} name="image" className="hidden" type="file"/>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Username</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.userName.isInvalid?'has-error form-control':'form-control'} disabled={this.props.isEdit} onChange={this.handleChangeValue} value={this.state.user.userName} name="userName" type="text" placeholder="Enter username"/>
                                {validation.userName.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.userName.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Password</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.password.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.password} name="password" type="password" placeholder="Enter password"/>
                                {validation.password.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.password.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Repeat Password</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.repassword.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.repassword} name="repassword" type="password" placeholder="Repeat password"/>
                                {validation.repassword.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.repassword.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Email</label>
                            </div>
                            <div className="col-8">
                                <input className={validation.email.isInvalid?'has-error form-control':'form-control'} disabled={this.props.isEdit} onChange={this.handleChangeValue} value={this.state.user.email} name="email" type="text" placeholder="Enter email"/>
                                {validation.email.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.email.message}
                                    </li>
                                </ul>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Name</label>
                            </div>
                            <div className="col-4">
                                <input className={validation.firstName.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.firstName} name="firstName" type="text" placeholder="First Name"/>
                                {validation.firstName.isInvalid && <ul className="parsley-errors-list filled">
                                    <li className="parsley-required">
                                        {validation.firstName.message}
                                    </li>
                                </ul>}
                            </div>
                            <div className="col-4">
                                <input className={validation.lastName.isInvalid?'has-error form-control':'form-control'} onChange={this.handleChangeValue} value={this.state.user.lastName} name="lastName" type="text" placeholder="Last Name"/>
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
                            !this.props.isEdit?<button className="btn btn-success" onClick={this.addUser}>Add user</button>:
                            <button className="btn btn-warning" onClick={this.updateUser}>Update</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);