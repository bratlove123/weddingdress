import React, {Component} from 'react';
import ReactLoading from 'react-loading';

class GlobalLoading extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="global-loading"><ReactLoading type={'bubbles'} color={'#02c0ce'} /></div>   
        );
    }
}

export default GlobalLoading;