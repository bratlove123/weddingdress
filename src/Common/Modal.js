import React, {Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends Component{
    constructor(props){
        super(props);

        this.state={
            modalIsOpen: false
        };

        this.handleOutsideClick=this.handleOutsideClick.bind(this);
        this.closeModal=this.closeModal.bind(this);
    }

    handleOutsideClick(e) {
        if (e.target && e.target.className==="modal-wrapper") {
            this.closeModal();
        }
    }
    
    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick, false);
    }
    
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    closeModal(){
        this.setState({modalIsOpen: false});
    }

    componentWillReceiveProps(nextProps){
        if(nextProps!==this.props){
            this.setState({modalIsOpen: nextProps.modalIsOpen});
        }
    }

    render(){
        return(
            <CSSTransitionGroup transitionName="modal" transitionEnterTimeout={100} transitionLeaveTimeout={100}>
                {this.state.modalIsOpen&&<div className="modal-mask">
                                    <div className="modal-wrapper">
                                        <div className="modal-container" style={{width: this.props.width + "px"}}>

                                            <div className="modal-header">
                                                <h3>
                                                    {this.props.header}
                                                </h3>              
                                                <button type="button" onClick={this.closeModal} className="close">&times;</button>
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