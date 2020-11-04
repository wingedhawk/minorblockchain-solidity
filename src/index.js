/* global process */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Navbar from './components/Navbar';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const env = {
  network: process.env.REACT_APP_ETH_NETWORK || 'development', // Default to Ganache CLI
};

ReactDOM.render(<Navbar {...env} />, document.getElementById('navbar'));
ReactDOM.render(<App {...env} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
