import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux';
import App, { store as appStore } from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// const rootReducer = combineReducers({
//     main: ...
// })

let store = createStore(appStore.getReduxReducer())
appStore.dispatch = store.dispatch; // 依赖注入

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
