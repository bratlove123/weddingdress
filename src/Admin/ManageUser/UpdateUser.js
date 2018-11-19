import React, {Component} from 'react';
import Layout from '../Common/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../Common/Modal';

class UpdateUser extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Modal header={!this.state.isEdit?"Add Left Nav":"Edit Left Nav"} modalIsOpen={this.state.modalIsOpen} handleClose={this.closeModal} width="700">
                    <Scrollbars autoHeight autoHeightMin={500} autoHide autoHideTimeout={1000} autoHideDuration={200}>
                        <div className="row fix-scroll">
                            <div className="col-6">
                                <div className="form-group m-b-20 row">
                                    <div className="col-12">
                                        <label>Nav name</label>
                                        <input onChange={this.handleChangeValue} value={this.state.navName} name="navName" className="form-control" type="text" placeholder="Enter nav name"/>
                                    </div>
                                </div>

                                <div className="form-group row m-b-20">
                                    <div className="col-12">
                                        <label>Nav URL</label>
                                        <input onChange={this.handleChangeValue} value={this.state.navUrl} name="navUrl" className="form-control" type="text" placeholder="Enter nav url"/>
                                    </div>
                                </div>

                                <div className="form-group row m-b-20">
                                    <div className="col-12">
                                        <label>Icon class</label>
                                        <input onChange={this.handleChangeValue} value={this.state.iconClass} name="iconClass" className="form-control" type="text" placeholder="Enter icon class"/>
                                    </div>
                                </div>

                                <div className="form-group row m-b-20">
                                    <div className="col-12">
                                        <div className="checkbox checkbox-custom">
                                            <input type="checkbox" name="isHasBadge" checked={this.state.isHasBadge} />
                                            <label onClick={this.setIsHasBadge}>
                                                Is Has Badge
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.isHasBadge&&<div className="row col-12">
                                        <div className="col-6">
                                            <input onChange={this.handleChangeValue} value={this.state.badgeClass} name="badgeClass" className="form-control" type="text" placeholder="Badge class"/>
                                        </div>
                                        <div className="col-6">
                                            <input onChange={this.handleChangeValue} value={this.state.badgeNumber} name="badgeNumber" className="form-control" type="text" placeholder="Badge number"/>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                            <div className="col-6">
                                
                                {!this.state.isHasBadge&&<div className="form-group row m-b-20">
                                    <div className="col-12 image-urls">
                                        <label>Childs</label>
                                        <div className="nav-childs">
                                            {
                                                this.state.childs.map((item, i) => {        
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
                            !this.state.isEdit?<button onClick={this.addNewItem} className="btn btn-success">Add new item</button>:
                            <button onClick={this.editLeftNavItem} className="btn btn-warning">Update</button>
                        }
                    </div>
                </Modal>
        );
    }
}

export default UpdateUser;