import React, {Component} from 'react';
import Layout from './Layout';
import {Link} from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class PageNotFound extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Layout>
                <div className="text-center">
                    <h1 className="text-error">404</h1>
                    <h4 className="text-uppercase text-danger mt-3">{i18n.t('PAGE_NOT_FOUND')}</h4>
                    <p className="text-muted mt-3">{i18n.t('PNF_INSTRUCTION')}</p>
                    <Link to="/" className="btn btn-md btn-block btn-custom waves-effect waves-light mt-3">{i18n.t('RETURN_HOME')}</Link>
                </div>
            </Layout>
        );
    }
}

export default withNamespaces('page_not_found')(PageNotFound);