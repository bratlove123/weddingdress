import React, {Component} from 'react';
import Layout from '../Common/Layout';

class Dashboard extends Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        document.title = "Dashboard";
    }
    
    render(){
        
        return(
            <Layout>
                This is HomePage Test
            </Layout>
        );
    }
}

export default Dashboard;