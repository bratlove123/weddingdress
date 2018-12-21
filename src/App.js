import React, { Component } from 'react';

//Import Base CSS
import './assets/css/bootstrap.min.css';
import './assets/css/icons.css';
import './assets/css/style.css';
import './assets/css/metismenu.min.css';
import './assets/css/custom_style.css';
import 'react-toastify/dist/ReactToastify.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

//Import component
import Routing from './Routing';

library.add(fas);

class App extends Component {
  render() {
    return (
        <Routing/>
    );
  }
}


export default App;
