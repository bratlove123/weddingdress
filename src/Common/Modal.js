import React, {Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends Component{
    constructor(props){
        super(props);

        this.state={
            modalIsOpen: this.props.modalIsOpen
        };

        this.handleOutsideClick=this.handleOutsideClick.bind(this);
    }

    handleOutsideClick(e) {
        if (e.target && e.target.className=="modal-wrapper") {
            this.props.handleClose();
        }
    }
    
    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick, false);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    render(){
        const modalIsOpen=this.props.modalIsOpen;
        return(
            <CSSTransitionGroup transitionName="modal" transitionEnterTimeout={100} transitionLeaveTimeout={100}>
                {modalIsOpen&&<div className="modal-mask">
                                    <div className="modal-wrapper">
                                        <div className="modal-container" style={{width: this.props.width + "px"}}>

                                            <div className="modal-header">
                                                <h3>
                                                    {this.props.header}
                                                </h3>              
                                                <button type="button" onClick={this.props.handleClose} className="close">&times;</button>
                                            </div>

                                            <div className="modal-body">
                                                {this.props.children}
                                            </div>
                                        </div>
                                    </div>
                                </div>}
            </CSSTransitionGroup>    
        );
    }
}

export default Modal;