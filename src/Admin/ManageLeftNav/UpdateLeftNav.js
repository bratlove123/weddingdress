import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import { Scrollbars } from 'react-custom-scrollbars';
import {createLeftNav, updateLeftNavDispatch} from '../../Store/Actions/manageLeftNavAction';
import {connect} from 'react-redux';
class UpdateLeftNav extends Component{
    constructor(props){
        super(props);

        this.state = {
            leftNav: {
                id: 0,
                navName: '',
                navUrl: '',
                iconClass: '',
                isHasBadge: false,
                badgeClass: '',
                badgeNumber: 0,
                childs: [
                    {
                        name:'',
                        url: ''
                    }
                ],
                del_arr: []
            }
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.addLeftNav = this.addLeftNav.bind(this);
        this.updateLeftNav = this.updateLeftNav.bind(this);
        this.setIsHasBadge = this.setIsHasBadge.bind(this);
        this.handleChildsChange = this.handleChildsChange.bind(this);
        this.addNewChildNav = this.addNewChildNav.bind(this);
        this.removeChildNav = this.removeChildNav.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.editLeftNavItem = this.editLeftNavItem.bind(this);
    }

    handleChangeValue(e){
        this.setState({leftNav: {...this.state.leftNav, [e.target.name]: e.target.value}});
    }

    addLeftNav(e){
        e.preventDefault();
        this.props.createLeftNav(this.state.leftNav);
    }
    updateLeftNav(e){
        e.preventDefault();
        this.props.updateLeftNavDispatch(this.state.leftNav);
    }

    setIsHasBadge(){
        this.setState({
            leftNav: {...this.state.leftNav, isHasBadge: !this.state.isHasBadge}
        });
    }

    handleChildsChange = (idx, field) => (evt) => {
        const newChilds = this.state.leftNav.childs.map((child, sidx) => {
            if (idx !== sidx) return child;
            if(field=='name'){
                return { ...child, name: evt.target.value };
            }
            else{
                return { ...child, url: evt.target.value };
            }
            
        });

        this.setState({ leftNav: {...this.state.leftNav, childs: newChilds} });
    }

    addNewChildNav(){
        this.setState({leftNav: {...this.state.leftNav, childs: this.state.leftNav.childs.concat({name:'', url: ''})}});
    }

    removeChildNav=(id)=>()=>{
        let thiz=this;
        let newChilds = thiz.state.leftNav.childs.filter((s, sidx)=>id!==sidx);
        let newDellArr = [];
        if(thiz.state.childs[id]._id){
            newDellArr = [...thiz.state.leftNav.del_arr, thiz.state.leftNav.childs[id]._id];
        }
        thiz.setState({leftNav: {...thiz.state.leftNav, childs: newChilds, del_arr: newDellArr}});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.leftNav){
            this.setState({
                leftNav: {
                    id: nextProps.leftNav.id,
                    navName: nextProps.leftNav.navName,
                    navUrl: nextProps.leftNav.navUrl,
                    iconClass: nextProps.leftNav.iconClass,
                    isHasBadge: nextProps.leftNav.isHasBadge,
                    badgeClass: nextProps.leftNav.badgeClass,
                    badgeNumber: nextProps.leftNav.badgeNumber,
                    childs: nextProps.leftNav.childs,
                    del_arr: nextProps.leftNav.del_arr
                }
            });
        }
    }

    addNewItem(){
        this.props.createLeftNav(this.state.leftNav);
    }

    editLeftNavItem(){
        this.props.updateLeftNavDispatch(this.state.leftNav);
    }

    render(){
        return(
        <Modal header={!this.props.isEdit?"Add Left Nav":"Edit Left Nav"} modalIsOpen={this.props.modalIsOpen} width="700">
            <Scrollbars autoHeight autoHeightMin={500} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                <div className="row fix-scroll">
                    <div className="col-6">
                        <div className="form-group m-b-20 row">
                            <div className="col-12">
                                <label>Nav name</label>
                                <input onChange={this.handleChangeValue} value={this.state.leftNav.navName} name="navName" className="form-control" type="text" placeholder="Enter nav name"/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-12">
                                <label>Nav URL</label>
                                <input onChange={this.handleChangeValue} value={this.state.leftNav.navUrl} name="navUrl" className="form-control" type="text" placeholder="Enter nav url"/>
                            </div>
                        </div>

                        <div className="form-group row m-b-20">
                            <div className="col-12">
                                <label>Icon class</label>
                                <input onChange={this.handleChangeValue} value={this.state.leftNav.iconClass} name="iconClass" className="form-control" type="text" placeholder="Enter icon class"/>
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
                                    <input onChange={this.handleChangeValue} value={this.state.leftNav.badgeClass} name="badgeClass" className="form-control" type="text" placeholder="Badge class"/>
                                </div>
                                <div className="col-6">
                                    <input onChange={this.handleChangeValue} value={this.state.leftNav.badgeNumber} name="badgeNumber" className="form-control" type="text" placeholder="Badge number"/>
                                </div>
                            </div>}
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
                                                        <input onChange={this.handleChildsChange(i, 'name')} value={item.name} className="form-control" type="text" placeholder="Enter child name"/>
                                                        <br/>
                                                        <input onChange={this.handleChildsChange(i, 'url')} value={item.url} className="form-control" type="text" placeholder="Enter child url"/>
                                                    </div>
                                                    <div className="col-2 margin-auto">
                                                        <button onClick={this.removeChildNav(i)} className="btn btn-danger">-</button>
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
                    !this.state.leftNav.isEdit?<button onClick={this.addNewItem} className="btn btn-success">Add new item</button>:
                    <button onClick={this.editLeftNavItem} className="btn btn-warning">Update</button>
                }
            </div>
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