import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import { Scrollbars } from 'react-custom-scrollbars';
import {createRoleGroup, updateRoleGroupDispatch} from '../../Store/Actions/manageRoleAction';
import {connect} from 'react-redux';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class UpdateRole extends Component{
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'code', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'name', parent: 'childs', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'code', parent: 'childs', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
        ]);

        this.state = {
            roleGroup: {
                _id: 0,
                name: '',
                code: '',
                childs: [
                    {
                        name:'',
                        code: ''
                    }
                ],
                del_arr: []
            },
            validation: this.validator.reset()
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.handleChildsChange = this.handleChildsChange.bind(this);
        this.addNewRole = this.addNewRole.bind(this);
        this.removeRole = this.removeRole.bind(this);
        this.addRoleGroup = this.addRoleGroup.bind(this);
        this.editRoleGroup = this.editRoleGroup.bind(this);
    }

    handleChangeValue(e){      
        this.setState({roleGroup: {...this.state.roleGroup, [e.target.name]: e.target.value}});
        const validation = this.validator.validate({...this.state.roleGroup, [e.target.name]: e.target.value}, e.target.name);
        this.setState({ validation });
    }

    handleChildsChange = (idx, field) => (evt) => {
        const newChilds = this.state.roleGroup.childs.map((child, sidx) => {
            if (idx !== sidx) return child;
            if(field==='name'){
                return { ...child, name: evt.target.value };
            }
            else{
                return { ...child, code: evt.target.value };
            }
        });

        this.setState({ roleGroup: {...this.state.roleGroup, childs: newChilds} });
        const validation = this.validator.validate({...this.state.roleGroup, childs: newChilds}, {field: field, id: idx});
        this.setState({ validation });
    }

    addNewRole(e){
        e.preventDefault();
        this.setState({roleGroup: {...this.state.roleGroup, childs: this.state.roleGroup.childs.concat({name:'', code: ''})}});
    }

    removeRole=(id)=>()=>{
        let thiz=this;
        let newChilds = [...thiz.state.roleGroup.childs];
        newChilds = newChilds.filter((s, sidx)=>id!==sidx);
        let newDellArr = [];
        if(thiz.state.roleGroup.childs[id]._id){
            newDellArr = [...thiz.state.roleGroup.del_arr, thiz.state.roleGroup.childs[id]._id];
        }
        thiz.setState({roleGroup: {...thiz.state.roleGroup, childs: newChilds, del_arr: newDellArr}});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.roleGroup){
            this.setState({
                roleGroup: {
                    _id: nextProps.roleGroup._id,
                    name: nextProps.roleGroup.name,
                    code: nextProps.roleGroup.code,
                    childs: nextProps.roleGroup.childs,
                    del_arr: nextProps.roleGroup.del_arr?nextProps.roleGroup.del_arr:[]
                },
                validation: this.validator.reset()
            });
        }
    }

    addRoleGroup(e){
        e.preventDefault();
        
        const validation = this.validator.validate(this.state.roleGroup);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createRoleGroup(this.state.roleGroup);
        }
    }

    editRoleGroup(e){
        e.preventDefault();

        const validation = this.validator.validate(this.state.roleGroup);
        this.setState({ validation });

        if(validation.isValid){
            this.props.updateRoleGroupDispatch(this.state.roleGroup);
        }
    }

    render(){
        let validation = this.state.validation;
        return(
        <Modal header={!this.props.isEdit?i18n.t("ADD_NEW_ROLE"):i18n.t("EDIT_ROLE")} modalIsOpen={this.props.modalIsOpen} width="700">
            <form>
                <Scrollbars autoHeight autoHeightMin={500} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                    <div className="row fix-scroll">
                        <div className="col-6">
                            <div className="form-group m-b-20 row">
                                <div className="col-12">
                                    <label>{i18n.t("NAME")}</label>
                                    <input className={validation.name.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.roleGroup.name} name="name" type="text" placeholder={i18n.t("NAME")}/>
                                    {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.name.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>{i18n.t("CODE")}</label>
                                    <input className={validation.code.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.roleGroup.code} name="code" type="text" placeholder={i18n.t("CODE")}/>
                                    {validation.code.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.code.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group row m-b-20">
                                <div className="col-12 image-urls">
                                    <label>{i18n.t("CHILDS")}</label>
                                    <div className="nav-childs">
                                        {
                                            this.state.roleGroup.childs.map((item, i) => {        
                                                return (
                                                    <div className="nav-child-item row" key={i}>
                                                        <div className="col-10">
                                                            <input className={validation.names && validation.names[i] && validation.names[i].isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChildsChange(i, 'name')} value={item.name} type="text" placeholder={i18n.t("ENTER_CHILD_NAME")}/>
                                                            {validation.names && validation.names[i] && validation.names[i].isInvalid && <ul className="parsley-errors-list filled">
                                                                <li className="parsley-required">
                                                                    {validation.names[i].message}
                                                                </li>
                                                            </ul>}
                                                            <input className={validation.codes && validation.codes[i] && validation.codes[i].isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChildsChange(i, 'code')} value={item.code} type="text" placeholder={i18n.t("ENTER_CHILD_CODE")}/>
                                                            {validation.codes && validation.codes[i] && validation.codes[i].isInvalid && <ul className="parsley-errors-list filled">
                                                                <li className="parsley-required">
                                                                    {validation.codes[i].message}
                                                                </li>
                                                            </ul>}
                                                        </div>
                                                        <div className="col-2 margin-auto">
                                                            <a className="form-control" href="javascript:void(0)" onClick={this.removeRole(i)} className="btn btn-danger"><i className="fi-cross"></i></a>
                                                        </div>
                                                    </div>
                                                ) 
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="col-12 btn-add-url">
                                    <button onClick={this.addNewRole} className="btn btn-primary">{i18n.t("ADD_MORE_CHILD")}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                
                </Scrollbars>
            
                <div className="modal-footer">
                    {
                        !this.props.isEdit?<button onClick={this.addRoleGroup} className="btn btn-success">{i18n.t("ADD_ITEM")}</button>:
                        <button onClick={this.editRoleGroup} className="btn btn-warning">{i18n.t("UPDATE")}</button>
                    }
                </div>
            </form>
        </Modal>)
    }
}

const mapStateToProps=(state)=>{
    return {
        roleGroup: state.manageRoleGroup.roleGroup
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createRoleGroup: (roleGroup) => dispatch(createRoleGroup(roleGroup)),
        updateRoleGroupDispatch: (roleGroup) => dispatch(updateRoleGroupDispatch(roleGroup))
    }
}

export default withNamespaces('updateRole')(connect(mapStateToProps, mapDispatchToProps)(UpdateRole));