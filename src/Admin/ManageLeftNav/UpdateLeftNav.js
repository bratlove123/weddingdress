import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import { Scrollbars } from 'react-custom-scrollbars';
import {createLeftNav, updateLeftNavDispatch} from '../../Store/Actions/manageLeftNavAction';
import {connect} from 'react-redux';
import FormValidator from '../../Common/FormValidator';

class UpdateLeftNav extends Component{
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: 'Name is required.'},
            { field: 'url', method: 'isEmpty', validWhen: false, message: 'Url is required.'},
            { field: 'name', parent: 'childs', method: 'isEmpty', validWhen: false, message: 'Name is required.'},
            { field: 'url', parent: 'childs', method: 'isEmpty', validWhen: false, message: 'Url is required.'},
        ]);

        this.state = {
            leftNav: {
                _id: 0,
                name: '',
                url: '',
                iconClass: '',
                isHasBadge: false,
                badgeClass: '',
                badgeNumber: 0,
                position: 0,
                childs: [
                    {
                        name:'',
                        url: '',
                        position: 0
                    }
                ],
                del_arr: []
            },
            validation: this.validator.reset()
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.setIsHasBadge = this.setIsHasBadge.bind(this);
        this.handleChildsChange = this.handleChildsChange.bind(this);
        this.addNewChildNav = this.addNewChildNav.bind(this);
        this.removeChildNav = this.removeChildNav.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.editLeftNavItem = this.editLeftNavItem.bind(this);
    }

    handleChangeValue(e){      
        this.setState({leftNav: {...this.state.leftNav, [e.target.name]: e.target.value}});
        const validation = this.validator.validate({...this.state.leftNav, [e.target.name]: e.target.value}, e.target.name);
        this.setState({ validation });
    }

    setIsHasBadge(){
        this.setState({
            leftNav: {...this.state.leftNav, isHasBadge: !this.state.leftNav.isHasBadge}
        });
    }

    handleChildsChange = (idx, field) => (evt) => {
        const newChilds = this.state.leftNav.childs.map((child, sidx) => {
            if (idx !== sidx) return child;
            if(field==='name'){
                return { ...child, name: evt.target.value };
            }
            else if(field==='url'){
                return { ...child, url: evt.target.value };
            }
            else{
                return { ...child, position: evt.target.value };
            }
        });

        this.setState({ leftNav: {...this.state.leftNav, childs: newChilds} });
        const validation = this.validator.validate({...this.state.leftNav, childs: newChilds}, {field: field, id: idx});
        this.setState({ validation });
    }

    addNewChildNav(e){
        e.preventDefault();
        this.setState({leftNav: {...this.state.leftNav, childs: this.state.leftNav.childs.concat({name:'', url: '', position: 0})}});
    }

    removeChildNav=(id)=>()=>{
        let thiz=this;
        let newChilds = [...thiz.state.leftNav.childs];
        newChilds = newChilds.filter((s, sidx)=>id!==sidx);
        let newDellArr = [];
        if(thiz.state.leftNav.childs[id]._id){
            newDellArr = [...thiz.state.leftNav.del_arr, thiz.state.leftNav.childs[id]._id];
        }
        thiz.setState({leftNav: {...thiz.state.leftNav, childs: newChilds, del_arr: newDellArr}});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.leftNav){
            this.setState({
                leftNav: {
                    _id: nextProps.leftNav._id,
                    name: nextProps.leftNav.name,
                    url: nextProps.leftNav.url,
                    iconClass: nextProps.leftNav.iconClass,
                    isHasBadge: nextProps.leftNav.isHasBadge,
                    badgeClass: nextProps.leftNav.badgeClass,
                    badgeNumber: nextProps.leftNav.badgeNumber,
                    childs: nextProps.leftNav.childs,
                    position: nextProps.leftNav.position,
                    del_arr: nextProps.leftNav.del_arr?nextProps.leftNav.del_arr:[]
                },
                validation: this.validator.reset()
            });
        }
    }

    addNewItem(e){
        e.preventDefault();
        
        const validation = this.validator.validate(this.state.leftNav);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createLeftNav(this.state.leftNav);
        }
    }

    editLeftNavItem(e){
        e.preventDefault();

        const validation = this.validator.validate(this.state.leftNav);
        this.setState({ validation });

        if(validation.isValid){
            this.props.updateLeftNavDispatch(this.state.leftNav);
        }
    }

    render(){
        let validation = this.state.validation;
        return(
        <Modal header={!this.props.isEdit?"Add Left Nav":"Edit Left Nav"} modalIsOpen={this.props.modalIsOpen} width="700">
            <form>
                <Scrollbars autoHeight autoHeightMin={500} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                    <div className="row fix-scroll">
                        <div className="col-6">
                            <div className="form-group m-b-20 row">
                                <div className="col-12">
                                    <label>Nav name</label>
                                    <input className={validation.name.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.leftNav.name} name="name" type="text" placeholder="Enter nav name"/>
                                    {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.name.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>Nav URL</label>
                                    <input className={validation.url.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.leftNav.url} name="url" type="text" placeholder="Enter nav url"/>
                                    {validation.url.isInvalid && <ul className="parsley-errors-list filled">
                                        <li className="parsley-required">
                                            {validation.url.message}
                                        </li>
                                    </ul>}
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>Icon class</label>
                                    <input autoComplete="off" onChange={this.handleChangeValue} value={this.state.leftNav.iconClass} name="iconClass" className="form-control" type="text" placeholder="Enter icon class"/>
                                </div>
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <div className="checkbox checkbox-custom">
                                        <input type="checkbox" name="isHasBadge" checked={this.state.leftNav.isHasBadge} />
                                        <label onClick={this.setIsHasBadge}>
                                            Is Has Badge
                                        </label>
                                    </div>
                                </div>
                                {this.state.isHasBadge&&<div className="row col-12">
                                    <div className="col-6">
                                        <input autoComplete="off" onChange={this.handleChangeValue} value={this.state.leftNav.badgeClass} name="badgeClass" className="form-control" type="text" placeholder="Badge class"/>
                                    </div>
                                    <div className="col-6">
                                        <input autoComplete="off" onChange={this.handleChangeValue} value={this.state.leftNav.badgeNumber} name="badgeNumber" className="form-control" type="text" placeholder="Badge number"/>
                                    </div>
                                </div>}
                            </div>

                            <div className="form-group row m-b-20">
                                <div className="col-12">
                                    <label>Position</label>
                                    <input autoComplete="off" onChange={this.handleChangeValue} value={this.state.leftNav.position} name="position" className="form-control" type="number" placeholder="Enter position"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            
                            {!this.state.leftNav.isHasBadge&&<div className="form-group row m-b-20">
                                <div className="col-12 image-urls">
                                    <label>Childs</label>
                                    <div className="nav-childs">
                                        {
                                            this.state.leftNav.childs.map((item, i) => {        
                                                return (
                                                    <div className="nav-child-item row" key={i}>
                                                        <div className="col-10">
                                                            <input className={validation.names && validation.names[i] && validation.names[i].isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChildsChange(i, 'name')} value={item.name} type="text" placeholder="Enter child name"/>
                                                            {validation.names && validation.names[i] && validation.names[i].isInvalid && <ul className="parsley-errors-list filled">
                                                                <li className="parsley-required">
                                                                    {validation.names[i].message}
                                                                </li>
                                                            </ul>}
                                                            <input className={validation.urls && validation.urls[i] && validation.urls[i].isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChildsChange(i, 'url')} value={item.url} type="text" placeholder="Enter child url"/>
                                                            {validation.urls && validation.urls[i] && validation.urls[i].isInvalid && <ul className="parsley-errors-list filled">
                                                                <li className="parsley-required">
                                                                    {validation.urls[i].message}
                                                                </li>
                                                            </ul>}
                                                            <input autoComplete="off" type="number" onChange={this.handleChildsChange(i, 'position')} value={item.position} className="form-control" placeholder="Enter child position"/>
                                                        </div>
                                                        <div className="col-2 margin-auto">
                                                            <a className="form-control" href="javascript:void(0)" onClick={this.removeChildNav(i)} className="btn btn-danger"><i className="fi-cross"></i></a>
                                                        </div>
                                                    </div>
                                                ) 
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="col-12 btn-add-url">
                                    <button onClick={this.addNewChildNav} className="btn btn-primary">Add more child</button>
                                </div>
                            </div>}
                        </div>
                    </div>
                
                </Scrollbars>
            
                <div className="modal-footer">
                    {
                        !this.props.isEdit?<button onClick={this.addNewItem} className="btn btn-success">Add new item</button>:
                        <button onClick={this.editLeftNavItem} className="btn btn-warning">Update</button>
                    }
                </div>
            </form>
        </Modal>)
    }
}

const mapStateToProps=(state)=>{
    return {
        leftNav: state.manageLeftNav.leftNav
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createLeftNav: (leftNav) => dispatch(createLeftNav(leftNav)),
        updateLeftNavDispatch: (leftNav) => dispatch(updateLeftNavDispatch(leftNav))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateLeftNav);