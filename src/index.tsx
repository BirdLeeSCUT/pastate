import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers, Store } from 'redux'
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { injectDispatch } from './services/redux-xstore';
import './index.css';

// 引入组件
import App, { store as appStore } from './containers/App';
import Home, { store as homeStore } from './containers/Home';

function makeRootStore(storeTree: any): Store<any>{

    // TODO: 遍历 storeTree 生成 rootReducer
    // 并移入 pastate 内部
    const rootReducer = combineReducers({
        app: appStore.getReduxReducer(),
        home: homeStore.getReduxReducer()
    })

    let reduxDevTools = window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()
    let rootStore = createStore(rootReducer, reduxDevTools)
    injectDispatch(rootStore, [appStore, homeStore])
    return rootStore;
}

let store = makeRootStore({
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
