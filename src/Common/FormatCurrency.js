
import React, {Component} from 'react';

class FormatCurrency extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return (
        <div className="format-currency">
            {(this.props.price*1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ'}
        </div>);
    }
}

export default FormatCurrency;