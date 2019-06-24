import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import {createUser, updateUserDispatch} from '../../Store/Actions/manageUserAction';
import {connect} from 'react-redux';

class UpdatePermission extends Component{
    constructor(props){
        super(props);

        this.state={
            rolesOfUser: [],
            allRoles: [],
            roleId: null
        };
        this.handleChangeValue=this.handleChangeValue.bind(this);
        this.updateUser=this.updateUser.bind(this);
    }

    checkRoleExistingInUserRoles(roleCode){
        var index = -1;
        for(let i=0;i<this.state.rolesOfUser.length;i++){
            if(this.state.rolesOfUser[i].code===roleCode){
                index = i;
            } 
        }
        return index;
    }

    handleChangeValue=(parentIdx, childIndx, ltChildIdx)=>()=>{
        if(childIndx!==undefined && ltChildIdx!==undefined){
            let newAllRoles = this.state.allRoles;
            newAllRoles[parentIdx].childs[childIndx*4+ltChildIdx].checked = !newAllRoles[parentIdx].childs[childIndx*4+ltChildIdx].checked;
            let newUserRoles = this.state.rolesOfUser;
            if(newAllRoles[parentIdx].childs[childIndx*4+ltChildIdx].checked){
                newUserRoles.push(newAllRoles[parentIdx].childs[childIndx*4+ltChildIdx]);
            }
            else{
                var index = this.checkRoleExistingInUserRoles(newAllRoles[parentIdx].childs[childIndx*4+ltChildIdx].code);
                if(index>=0){
                    newUserRoles.splice(index, 1);
                }
            }
            this.setState({allRoles: newAllRoles, rolesOfUser: newUserRoles});
        }
        else{
            let newAllRoles = this.state.allRoles;
            let newUserRoles = this.state.rolesOfUser;
            let checker = !newAllRoles[parentIdx].checked;
            newAllRoles[parentIdx].checked = checker;
            newAllRoles[parentIdx].childs.map((e,i)=>{
                e.checked = checker;

                if(checker){
                    newUserRoles.push(e);
                }
                else{
                    var index = this.checkRoleExistingInUserRoles(e.code);
                    if(index>=0){
                        newUserRoles.splice(index, 1);
                    }
                }
            });
            this.setState({allRoles: newAllRoles, rolesOfUser: newUserRoles});
        }
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.rolesOfUser && nextProps.allRoles){
            let allRoles = JSON.parse(JSON.stringify(nextProps.allRoles));
            let userRoles = nextProps.rolesOfUser.map((e)=>{
                return e.code;
            });
    
            //Check checked for checkbox
            allRoles.map((item, i)=>{
                var checkHead = 0;
                item.childs.map((e, j)=>{
                    if(userRoles.indexOf(e.code)>=0){
                        e.checked = true;
                        checkHead++;
                    }
                });
                if(checkHead===item.childs.length){
                    item.checked = true;
                }
            });
            this.setState({
                rolesOfUser: nextProps.rolesOfUser,
                allRoles: allRoles,
                roleId: nextProps.roleId
            });
        }
    }
    updateUser(e){
        e.preventDefault();
        var roles = this.state.rolesOfUser.map((e)=>{
            return e._id;
        });
        this.props.updateUserDispatch({roles: roles, _id: this.state.roleId});
    }
    render(){
        let allRoles = JSON.parse(JSON.stringify(this.state.allRoles));
        let userRoles = this.state.rolesOfUser.map((e)=>{
            return e.code;
        });

        //Check checked for checkbox
        allRoles.map((item, i)=>{
            var checkHead = 0;
            item.childs.map((e, j)=>{
                if(userRoles.indexOf(e.code)>=0){
                    e.checked = true;
                    checkHead++;
                }
            });
            if(checkHead===item.childs.length){
                item.checked = true;
            }
            else{
                item.checked=false;
            }
        });
        allRoles.map((item, i)=>{
            item.childs = item.childs.map((e, j)=>{
                return j % 4 === 0 ? item.childs.slice(j, j+4) : null;
            }).filter(x=>x!=null);
        });
        return(
            <Modal header="Update permission" modalIsOpen={this.props.modalPermissionIsOpen} width="850">
                <form>
                    <div className="row container display-block">
                        {allRoles.map((item, i) => {  
                            return(
                            <div className="select-form" key={i}>
                                <div className="role-title">
                                    <div className="checkbox checkbox-custom">
                                        <input type="checkbox" checked={item.checked} />
                                        <label onClick={this.handleChangeValue(i)}>
                                            {item.name}
                                        </label>
                                    </div>
                                </div>
                                <div className="list-inline">
                                    {
                                        item.childs.map((child, j) => {
                                            return (<div className="row" key={j}>
                                                {child.map((c, k)=>{
                                                    return (
                                                    <div className="col-md-3" key={k}>
                                                        <div className="checkbox checkbox-custom">
                                                            <input type="checkbox" checked={c.checked} />
                                                            <label onClick={this.handleChangeValue(i, j, k)}>
                                                                {c.name}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    )
                                                })}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>)
                            })
                        }
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-warning" onClick={this.updateUser}>Update</button>
                    </div>
                </form>
            </Modal>
        );
    }
}
const mapStateToProps=(state)=>{
    return {
        rolesOfUser: state.manageUser.rolesOfUser,
        allRoles: state.manageUser.allRoles,
        roleId: state.manageUser.roleId
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        updateUserDispatch: (user) => dispatch(updateUserDispatch(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePermission);