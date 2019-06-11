import React, {Component} from 'react';
import Layout from './Layout';
import {Link} from 'react-router-dom';

class PageNotFound extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Layout>
                <div className="text-center">
                    <h1 className="text-error">404</h1>
                    <h4 className="text-uppercase text-danger mt-3">Page Not Found</h4>
                    <p className="text-muted mt-3">It's looking like you may have taken a wrong turn. Don't worry... it
                        happens to the best of us. Here's a
                        little tip that might help you get back on track.</p>

                    <Link to="/" className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3"> Return Home</Link>
                </div>
            </Layout>
        );
    }
}

export default PageNotFound;