import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import { Scrollbars } from 'react-custom-scrollbars';
import {createType, updateTypeDispatch} from '../../Store/Actions/manageTypeAction';
import {connect} from 'react-redux';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class UpdateType extends Component{
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'name', parent: 'sizes', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")}
        ]);

        this.state = {
            type: {
                _id: 0,
                name: '',
                sizes: [
                    {
                        name:''
                    }
                ],
                del_arr: []
            },
            validation: this.validator.reset()
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.setIsHasBadge = this.setIsHasBadge.bind(this);
        this.handleChildsChange = this.handleChildsChange.bind(this);
        this.addNewChildType = this.addNewChildType.bind(this);
        this.removeChildType = this.removeChildType.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.editTypeItem = this.editTypeItem.bind(this);
    }

    handleChangeValue(e){      
        this.setState({type: {...this.state.type, [e.target.name]: e.target.value}});
        const validation = this.validator.validate({...this.state.type, [e.target.name]: e.target.value}, e.target.name);
        this.setState({ validation });
    }

    setIsHasBadge(){
        this.setState({
            type: {...this.state.type, isHasBadge: !this.state.type.isHasBadge}
        });
    }

    handleChildsChange = (idx, field) => (evt) => {
        const newChilds = this.state.type.sizes.map((child, sidx) => {
            if (idx !== sidx) return child;
            if(field==='name'){
                return { ...child, name: evt.target.value };
            }
        });

        this.setState({ type: {...this.state.type, sizes: newChilds} });
        const validation = this.validator.validate({...this.state.type, sizes: newChilds}, {field: field, id: idx});
        this.setState({ validation });
    }

    addNewChildType(e){
        e.preventDefault();
        this.setState({type: {...this.state.type, sizes: this.state.type.sizes.concat({name:'', url: '', position: 0})}});
    }

    removeChildType=(id)=>()=>{
        let thiz=this;
        let newChilds = [...thiz.state.type.sizes];
        newChilds = newChilds.filter((s, sidx)=>id!==sidx);
        let newDellArr = [];
        if(thiz.state.type.sizes[id]._id){
            newDellArr = [...thiz.state.type.del_arr, thiz.state.type.sizes[id]._id];
        }
        thiz.setState({type: {...thiz.state.type, sizes: newChilds, del_arr: newDellArr}});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.type){
            this.setState({
                type: {
                    _id: nextProps.type._id,
                    name: nextProps.type.name,
                    sizes: nextProps.type.sizes,
                    del_arr: nextProps.type.del_arr?nextProps.type.del_arr:[]
                },
                validation: this.validator.reset()
            });
        }
    }

    addNewItem(e){
        e.preventDefault();
        
        const validation = this.validator.validate(this.state.type);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createType(this.state.type);
        }
    }

    editTypeItem(e){
        e.preventDefault();

        const validation = this.validator.validate(this.state.type);
        this.setState({ validation });

        if(validation.isValid){
            this.props.updateTypeDispatch(this.state.type);
        }
    }

    render(){
        let validation = this.state.validation;
        return(
        <Modal header={!this.props.isEdit?i18n.t("ADD_NEW_TYPE"):i18n.t("EDIT_TYPE")} modalIsOpen={this.props.modalIsOpen} width="700">
            <form>
                <Scrollbars autoHeight autoHeightMin={300} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                    <div className="row fix-scroll">
                        <div className="col-6">
                            <div className="form-group m-b-20 row">
                                <div className="col-12">
                                    <label>{i18n.t("TYPE_NAME")}</label>
                                    <input className={validation.name.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.type.name} name="name" type="text" placeholder={i18n.t("TYPE_NAME")}/>
                                    {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.name.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            
                            {<div className="form-group row m-b-20">
                                <div className="col-12 image-urls">
                                    <label>{i18n.t("SIZE_CHILDS")}</label>
                                    <div className="nav-childs">
                                        {
                                            this.state.type.sizes.map((item, i) => {        
                                                return (
                                                    <div className="nav-child-item row" key={i}>
                                                        <div className="col-10">
                                                            <input className={validation.names && validation.names[i] && validation.names[i].isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChildsChange(i, 'name')} value={item.name} type="text" placeholder={i18n.t("TYPE_CHILD_NAME")}/>
                                                            {validation.names && validation.names[i] && validation.names[i].isInvalid && <ul className="parsley-errors-list filled">
                                                                <li className="parsley-required">
                                                                    {validation.names[i].message}
                                                                </li>
                                                            </ul>}
                                                        </div>
                                                        <div className="col-2 margin-auto">
                                                            <a className="form-control" href="javascript:void(0)" onClick={this.removeChildType(i)} className="btn btn-danger"><i className="fi-cross"></i></a>
                                                        </div>
                                                    </div>
                                                ) 
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="col-12 btn-add-url">
                                    <button onClick={this.addNewChildType} className="btn btn-primary">{i18n.t("ADD_MORE_CHILD")}</button>
                                </div>
                            </div>}
                        </div>
                    </div>
                
                </Scrollbars>
            
                <div className="modal-footer">
                    {
                        !this.props.isEdit?<button onClick={this.addNewItem} className="btn btn-success">{i18n.t("ADD_ITEM")}</button>:
                        <button onClick={this.editTypeItem} className="btn btn-warning">{i18n.t("UPDATE")}</button>
                    }
                </div>
            </form>
        </Modal>)
    }
}

const mapStateToProps=(state)=>{
    return {
        type: state.manageType.type
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createType: (type) => dispatch(createType(type)),
        updateTypeDispatch: (type) => dispatch(updateTypeDispatch(type))
    }
}

export default withNamespaces('updateType')(connect(mapStateToProps, mapDispatchToProps)(UpdateType));