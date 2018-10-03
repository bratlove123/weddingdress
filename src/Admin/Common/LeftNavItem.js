import React, {Component} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {Link} from 'react-router-dom';

class LeftNavItem extends Component{
    constructor(props){
        super(props);

        this.state = {
            toggle:false
        }
        this.toggleItem=this.toggleItem.bind(this);
    }

    toggleItem(){
        this.setState({toggle: !this.state.toggle});
    }

    componentWillMount(){
        const config = this.props.config;
        config.childs.map((item, i) => {        
            if(item.url==window.location.pathname){
                this.setState({toggle:true});
            }
        })
    }

    render(){
        const config = this.props.config;
        const ulHtml = this.state.toggle?<ul className="nav-second-level">
                                            {config.childs.map((item, i) => {        
                                                return (<li key={i} className={item.url==window.location.pathname?'active':''}><Link to={item.url}>{item.name}</Link></li>) 
                                            })}
                                        </ul>:"";
    
        return(
            <li className={this.state.toggle?'active':''}>
                <a className={this.state.toggle?'active':''} onClick={this.toggleItem} href={config.url}>
                    <i className={config.iconClass}></i> 
                    <span> {config.name} </span> 
                    {config.isHasBadge?<span className={`badge badge-pill pull-right ${config.badgeClass}`}>{config.badgeNumer}</span>:<span className="menu-arrow"></span>}                  
                </a>

                <CSSTransitionGroup transitionName="example" transitionEnterTimeout={700} transitionLeaveTimeout={700}>
                    {ulHtml}
                </CSSTransitionGroup>
            </li>
        );
    }
}

export default LeftNavItem;