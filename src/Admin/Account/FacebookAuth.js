import {Component} from 'react';
import queryString from 'query-string';

class FacebookAuth extends Component{
    constructor(props){
        super(props);
        var params = queryString.parse(this.props.location.search)
        var accessToken = params.access_token;
        var message = {};
        if (accessToken) {
            message.status = true;
            message.accessToken = accessToken;
        }
        else
        {
            message.status = false;
            message.error = params.error;
            message.errorDescription = params.error_description;
        }
        window.parent.postMessage(JSON.stringify(message), window.location.origin);
    }

    render(){
        return "";
    };
}

export default FacebookAuth;