import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { makeReduxStore } from './services/redux-xstore';
import './index.css';

// 引入组件
import App, { store as appStore } from './containers/App';

let store = makeReduxStore({
    app: appStore
})

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Route exact={true} path="/" component={App} />
            </div>
        </Router>
    </Provider>
    ,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
