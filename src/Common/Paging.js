
import React, {Component} from 'react';
import Common from '../Consts/Common';

class Paging extends Component{

    constructor(props){
        super(props);
    }

    pageClick=(page)=>()=>{
        if(page=='prev'){
            page=this.props.currentPage-1;
        }
        if(page=='next'){
            page=this.props.currentPage+1;
        }
        this.props.getData(page);
    }

    render(){
        return (
        <div className="row">
            <div className="col-sm-12 col-md-5">
                <div className="dataTables_info">Showing {(this.props.currentPage-1)*Common.pageSize+1} to {this.props.currentPage==this.props.totalPage?this.props.totalItemCount:(this.props.currentPage-1)*Common.pageSize+Common.pageSize} of {this.props.totalItemCount} entries</div>
            </div>
            <div className="col-sm-12 col-md-7">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination">
                        <li className={this.props.currentPage==1?"paginate_button page-item previous disabled":"paginate_button page-item previous"}>
                            <a href="javascript:void(0)" onClick={this.pageClick(1)} className="page-link">First</a>
                        </li>
                        <li className={this.props.currentPage==1?"paginate_button page-item previous disabled":"paginate_button page-item previous"}>
                            <a href="javascript:void(0)" onClick={this.pageClick('prev')} className="page-link">Previous</a>
                        </li>
                        {
                            Array.from(Array(this.props.totalPage), (e, i) => {
                                return (
                                    <li  className={i+1==this.props.currentPage?"paginate_button page-item active":"paginate_button page-item"} key={i}>
                                        <a href="javascript:void(0)" onClick={this.pageClick(i+1)} className="page-link">{i+1}</a>
                                    </li>
                                );
                            })
                        }
                        <li className={this.props.currentPage==this.props.totalPage?"paginate_button page-item next disabled":"paginate_button page-item next"}>
                            <a href="javascript:void(0)" onClick={this.pageClick('next')} className="page-link">Next</a>
                        </li>
                        <li className={this.props.currentPage==this.props.totalPage?"paginate_button page-item next disabled":"paginate_button page-item next"}>
                            <a href="javascript:void(0)" onClick={this.pageClick(this.props.totalPage)} className="page-link">Last</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>);
    }
}

export default Paging;