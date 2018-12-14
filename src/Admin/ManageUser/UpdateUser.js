import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import selectImg from '../../assets/images/select-image.png';
import {createUser} from '../../Store/Actions/manageUserAction';
import {connect} from 'react-redux';
import ReactLoading from 'react-loading';

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
    triggerInputFile(){ 
        this.fileInput.click();
    }
    addUser(){
        this.props.createUser(this.state.user);
    }
    updateUser(){

    }
    render(){
        return(
            <Modal header={!this.props.isEdit?"Add New User":"Edit User"} modalIsOpen={this.props.modalIsOpen} width="450">
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
                            <input onChange={this.handleChangeValue} value={this.state.user.username} name="username" className="form-control" type="text" placeholder="Enter username"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-4">
                            <label className="fix-label-form">Password</label>
                        </div>
                        <div className="col-8">
                            <input onChange={this.handleChangeValue} value={this.state.user.password} name="password" className="form-control" type="password" placeholder="Enter password"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-4">
                            <label className="fix-label-form">Repeat Password</label>
                        </div>
                        <div className="col-8">
                            <input onChange={this.handleChangeValue} value={this.state.user.repassword} name="repassword" className="form-control" type="password" placeholder="Repeat password"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-4">
                            <label className="fix-label-form">Email</label>
                        </div>
                        <div className="col-8">
                            <input onChange={this.handleChangeValue} value={this.state.user.email} name="email" className="form-control" type="text" placeholder="Enter email"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-4">
                            <label className="fix-label-form">Name</label>
                        </div>
                        <div className="col-4">
                            <input onChange={this.handleChangeValue} value={this.state.user.firstName} name="firstName" className="form-control" type="text" placeholder="First Name"/>
                        </div>
                        <div className="col-4">
                            <input onChange={this.handleChangeValue} value={this.state.user.lastName} name="lastName" className="form-control" type="text" placeholder="Last Name"/>
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-4">
                            <label className="fix-label-form">Role</label>
                        </div>
                        <div className="col-8">
                            <select onChange={this.handleChangeValue} value={this.state.user.role} name="role" className="form-control">
                                <option>Select Role</option>
                                <option>Admin</option>
                                <option>Manager</option>
                                <option>Member</option>
                            </select>                        
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    {
                        !this.state.isEdit?<button className="btn btn-success" onClick={this.addUser}>Add new item</button>:
                        <button className="btn btn-warning" onClick={this.updateUser}>Update</button>
                    }
                </div>
            </Modal>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createUser: (user) => dispatch(createUser(user))
    }
}

export default connect(null, mapDispatchToProps)(UpdateUser);