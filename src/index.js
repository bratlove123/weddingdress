import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './Store/Reducers/rootReducer';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import './Consts/i18n';

const store =  createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
<Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</Provider>
, document.getElementById('root'));
registerServiceWorker();
