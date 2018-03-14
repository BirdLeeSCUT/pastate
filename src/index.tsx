import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { combineStores, makeApp } from './pastate';
import './index.css';

// 引入组件
import App, { store as appStore } from './containers/App';


let root = makeApp(
    <Router>
        <Route exact={true} path="/" component={App} />
    </Router>,
    appStore
)

ReactDOM.render(root, document.getElementById('root') as HTMLElement);

registerServiceWorker();
