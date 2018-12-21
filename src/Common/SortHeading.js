
import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SortHeading extends Component{

    constructor(props){
        super(props);
        this.sortByProperty=this.sortByProperty.bind(this);
    }

    sortByProperty(){
        if(this.props.name!==this.props.currentSort){
            this.props.getDataForSort(this.props.name, true, 0);
        }
        else{
            switch(this.props.currentArrow){
                case -1:
                    this.props.getDataForSort(this.props.name, true, 0);
                    break;
                case 0:
                    this.props.getDataForSort(this.props.name, false, 1);
                    break;
                case 1:
                    this.props.getDataForSort("Id", true, -1);
                    break;
                default:
                    break;
            }
        }
    }

    renderSortHeader(){
        let htmlSort = <FontAwesomeIcon icon="arrows-alt-v" />;
        if(this.props.currentSort==this.props.name){
            switch(this.props.currentArrow){
                case -1:
                    htmlSort=<FontAwesomeIcon icon="arrows-alt-v" />;
                    break;
                case 0:
                    htmlSort=<FontAwesomeIcon icon="long-arrow-alt-down" />;
                    break;
                case 1:
                    htmlSort=<FontAwesomeIcon icon="long-arrow-alt-up" />;
                    break;
            }
        }
        return htmlSort;
    }

    render(){
        return (
            <th className="sorting-header" 
            onClick={this.sortByProperty}> {this.props.children} {this.renderSortHeader()}</th>);
    }
}

export default SortHeading;