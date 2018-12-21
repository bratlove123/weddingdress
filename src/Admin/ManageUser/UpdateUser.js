import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createUser, updateUserDispatch} from '../../Store/Actions/manageUserAction';
import {connect} from 'react-redux';
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import Select from 'react-validation/build/select';
import Common from '../../Consts/Common';

const required = (value) => {
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <small className="error">This field is required.</small>;
    }
};

const email = (value) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(value.toLowerCase())) {
        return <small className="error">Invalid email format</small>;
    }
};

const minlength = (value) => {
    if (value.trim().length < 6) {
        return <small className="error">Password must be at least 6 characters long</small>;
    }
};

const match = (value, props, components) =>{
    if (value !== components['password'][0].value) {
        return <small className="error">Passwords are not equal.</small>
    }
};

class UpdateUser extends Component{
    fileInput=null;
    constructor(props){
        super(props);

        this.state={
            user: {
                avatar: null,
                username: "",
                password: "",
                repassword: "",
                email: "",
                firstName: "",
                lastName: "",
                role: ""
            },
            avatarSrc: selectImg
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
            var avatar = e.target.name;
             reader.onloadend = function (e) {
                this.setState({
                    avatarSrc: [reader.result],
                    user: {...this.state.user, avatar: file}
                });
              }.bind(this);
        }
        else{
            this.setState({user: {...this.state.user, [e.target.name]: e.target.value}});
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.user){
            this.setState({
                user: {
                    username: nextProps.user.username,
                    password: "",
                    repassword: "",
                    email: nextProps.user.email,
                    firstName: nextProps.user.firstName,
                    lastName: nextProps.user.lastName,
                    role: nextProps.user.role,
                    id: nextProps.user.id
                },
                avatarSrc: nextProps.user.avatar?Common.imgUrl+nextProps.user.avatar:selectImg
            });
        }
    }
    triggerInputFile(){ 
        this.fileInput.click();
    }
    addUser(e){
        e.preventDefault();
        this.props.createUser(this.state.user);
    }
    updateUser(e){
        e.preventDefault();
        this.props.updateUserDispatch(this.state.user);
    }
    render(){
        return(
            <Modal user={this.props.user} header={!this.props.isEdit?"Add New User":"Edit User"} modalIsOpen={this.props.modalIsOpen} width="450">
                <Form>
                    <div className="row container display-block">
                        <div className="form-group row display-block text-center">
                            <img title="Choose the avatar..." className="avatar-img" src={this.state.avatarSrc} onClick={this.triggerInputFile}/>
                            <input accept="image/x-png,image/gif,image/jpeg" ref={fileInput=>this.fileInput=fileInput} onChange={this.handleChangeValue} name="avatar" className="hidden" type="file"/>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Username</label>
                            </div>
                            <div className="col-8">
                            {!this.props.isEdit?<Input validations={[required, minlength]} onChange={this.handleChangeValue} value={this.state.user.username} name="username" className="form-control" type="text" placeholder="Enter username"/>
                                :<input disabled="disabled" value={this.state.user.username} name="username" className="form-control" type="text" placeholder="Enter username"/>}
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Password</label>
                            </div>
                            <div className="col-8">
                                <Input validations={[required, minlength]} onChange={this.handleChangeValue} value={this.state.user.password} name="password" className="form-control" type="password" placeholder="Enter password"/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Repeat Password</label>
                            </div>
                            <div className="col-8">
                                <Input validations={[required, match]} onChange={this.handleChangeValue} value={this.state.user.repassword} name="repassword" className="form-control" type="password" placeholder="Repeat password"/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Email</label>
                            </div>
                            <div className="col-8">
                            {!this.props.isEdit?
                                <Input validations={[required, email]} onChange={this.handleChangeValue} value={this.state.user.email} name="email" className="form-control" type="text" placeholder="Enter email"/>
                                :
                                <input disabled="disabled" value={this.state.user.email} name="email" className="form-control" type="text" placeholder="Enter email"/>
                            }
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Name</label>
                            </div>
                            <div className="col-4">
                                <Input validations={[required]} onChange={this.handleChangeValue} value={this.state.user.firstName} name="firstName" className="form-control" type="text" placeholder="First Name"/>
                            </div>
                            <div className="col-4">
                                <Input validations={[required]} onChange={this.handleChangeValue} value={this.state.user.lastName} name="lastName" className="form-control" type="text" placeholder="Last Name"/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-4">
                                <label className="fix-label-form">Role</label>
                            </div>
                            <div className="col-8">
                                <Select validations={[required]} onChange={this.handleChangeValue} value={this.state.user.role} name="role" className="form-control">
                                    <option></option>
                                    {this.props.roles.map((role, index)=>{
                                        return (
                                            <option value={role} key={index}>{role}</option>
                                        )
                                    })}
                                </Select>                        
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            !this.props.isEdit?<Button className="btn btn-success" onClick={this.addUser}>Add new item</Button>:
                            <Button className="btn btn-warning" onClick={this.updateUser}>Update</Button>
                        }
                    </div>
                </Form>
            </Modal>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        user: state.manageUser.user,
        roles: state.manageUser.roles
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (user) => dispatch(createUser(user)),
        updateUserDispatch: (user) => dispatch(updateUserDispatch(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser);