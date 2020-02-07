import React from 'react';
import ReactDOM from 'react-dom';
// import ReactDOMServer from 'react-dom/server';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';

ReactDOM.hydrate(<App />, document.getElementById('main'));


// console.log(ReactDOMServer.renderToString(<App />));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// serviceWorker.register();
