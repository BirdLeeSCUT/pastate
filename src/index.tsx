import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { makeReduxStore } from './services/redux-xstore';
import './index.css';

// 引入组件
import App, { store as appStore } from './containers/App';
import Home, { store as homeStore } from './containers/Home';

let store = makeReduxStore({
    app: appStore,
    home: homeStore
})

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Route exact={true} path="/" component={App} />
                <Route path="/home" component={Home} />
            </div>
        </Router>
    </Provider>
    ,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
