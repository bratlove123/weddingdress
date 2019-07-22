import React, {Component} from 'react';
import Modal from '../../Common/Modal';
import {createColor, updateColorDispatch} from '../../Store/Actions/manageColorAction';
import {connect} from 'react-redux';
import FormValidator from '../../Common/FormValidator';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';
import { SketchPicker } from 'react-color';

class UpdateColor extends Component{
    constructor(props){
        super(props);

        this.validator = new FormValidator([
            { field: 'name', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")},
            { field: 'code', method: 'isEmpty', validWhen: false, message: i18n.t("VALIDATE_REQUIRED")}
        ]);

        this.state = {
            color: {
                _id: 0,
                name: '',
                code: ''
            },
            validation: this.validator.reset(),
            displayColorPicker: false,
            defaultColor: "#999",
            changeColor: "#999",
            colorPicker: {
                r: "0",
                g: "9",
                b: "153",
                a: "1"
            }
        }

        this.handleChangeValue = this.handleChangeValue.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.editColorItem = this.editColorItem.bind(this);
    }

    handleChangeValue(e){      
        this.setState({color: {...this.state.color, [e.target.name]: e.target.value}});
        const validation = this.validator.validate({...this.state.color, [e.target.name]: e.target.value}, e.target.name);
        this.setState({ validation });
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.color){
            this.setState({
                color: {
                    _id: nextProps.color._id,
                    name: nextProps.color.name,
                    code: nextProps.color.code
                },
                validation: this.validator.reset()
            });
        }
    }

    addNewItem(e){
        e.preventDefault();
        
        const validation = this.validator.validate(this.state.color);
        this.setState({ validation });

        if(validation.isValid){
            this.props.createColor(this.state.color);
        }
    }

    editColorItem(e){
        e.preventDefault();

        const validation = this.validator.validate(this.state.color);
        this.setState({ validation });

        if(validation.isValid){
            this.props.updateColorDispatch(this.state.color);
        }
    }

    onHandleShowColorPicker=()=>{
        this.setState({displayColorPicker: !this.state.displayColorPicker});
    }

    onChangeColorPicker=color=>{
        this.setState({colorPicker: color.rgb, color: {...this.state.color, code: color.hex}});
    }

    render(){
        let validation = this.state.validation;
        return(
        <Modal header={!this.props.isEdit?i18n.t("ADD_NEW_COLOR"):i18n.t("EDIT_COLOR")} modalIsOpen={this.props.modalIsOpen} height = "350" width="400">
            <form>
            <div className="row fix-scroll">
                <div className="col-12">
                    <div className="form-group m-b-20 row">
                        <div className="col-12">
                            <label>{i18n.t("COLOR_NAME")}</label>
                            <input className={validation.name.isInvalid?'has-error form-control':'form-control'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.color.name} name="name" type="text" placeholder={i18n.t("COLOR_NAME")}/>
                            {validation.name.isInvalid && <ul className="parsley-errors-list filled">
                                <li className="parsley-required">
                                    {validation.name.message}
                                </li>
                            </ul>}
                        </div>
                    </div>

                    <div className="form-group row m-b-20">
                        <div className="col-12">
                            <label>{i18n.t("COLOR_CODE")}</label>
                            <div onClick={()=>this.onHandleShowColorPicker()} className="inner-addon right-addon">
                                <i style={{'color': this.state.color.code}} className="fi fi-drop"></i>      
                                <input className={validation.code.isInvalid?'has-error form-control text-color':'form-control text-color'} autoComplete="off" onChange={this.handleChangeValue} value={this.state.color.code} name="code" type="text" placeholder={i18n.t("COLOR_CODE")}/>
                            </div>
                            {validation.code.isInvalid && <ul className="parsley-errors-list filled">
                                <li className="parsley-required">
                                    {validation.code.message}
                                </li>
                            </ul>}

                            {this.state.displayColorPicker&&
                            <div className="color-picker-container">
                                 <div className="color-picker-pallet">
                                    <div className="color-picker-cover">
                                        <SketchPicker 
                                            color={this.state.colorPicker}
                                            onChange={this.onChangeColorPicker}
                                        />
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>

                </div>

            </div>
                <div className="modal-footer">
                    {
                        !this.props.isEdit?<button onClick={this.addNewItem} className="btn btn-success">{i18n.t("ADD_ITEM")}</button>:
                        <button onClick={this.editColorItem} className="btn btn-warning">{i18n.t("UPDATE")}</button>
                    }
                </div>
            </form>
        </Modal>)
    }
}

const mapStateToProps=(state)=>{
    return {
        color: state.manageColor.color
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        createColor: (color) => dispatch(createColor(color)),
        updateColorDispatch: (color) => dispatch(updateColorDispatch(color))
    }
}

export default withNamespaces('updateColor')(connect(mapStateToProps, mapDispatchToProps)(UpdateColor));