import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import i18n from '../../Consts/i18n';

class Breadcrumb extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const breadcrumb = this.props.breadcrumb;
        return(
            <ul className="list-inline menu-left mb-0">
                <li className="float-left">
                    <button className="button-menu-mobile open-left disable-btn">
                        <i className="dripicons-menu"></i>
                    </button>
                </li>
                <li>
                    <div className="page-title-box">
                        <h4 className="page-title">{i18n.t(breadcrumb&&breadcrumb.length>0&&breadcrumb[breadcrumb.length-1].name)} </h4>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin">Highdmin</Link></li>
                            {
                                breadcrumb&&breadcrumb.map((v, i)=>{
                                    return (<li className={i==breadcrumb.length-1?"breadcrumb-item active":"breadcrumb-item"} key={i}>{i==breadcrumb.length-1?i18n.t(v.name):<Link to={v.url?v.url:"#"}>{i18n.t(v.name)}</Link>}</li>)
                                })
                            }
                        </ol>
                    </div>
                </li>

            </ul>
        );
    }
}

export default withNamespaces('breadcrumb')(Breadcrumb);
