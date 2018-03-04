import * as React from 'react';
import { Reducer, createStore, combineReducers, Store } from 'redux';
import { connect, Provider } from 'react-redux';
import { XStore } from './pastore';

export function makeReduxStore(storeTree: any): Store<any> {
    let partXStoreArr: Array<XStore<any>> = [];
    let makePastateStoreToBeReducer = function (_storeTree: any): Reducer<any> {
        if (_storeTree.__PASTATE_STORE__) {
            return _storeTree.getReduxReducer();
        }
        let node = {}
        for (const key in _storeTree) {
            if (_storeTree.hasOwnProperty(key)) {
                if (_storeTree[key].__PASTATE_STORE__) {
                    node[key] = _storeTree[key].getReduxReducer();
                    partXStoreArr.push(_storeTree[key])
                } else {
                    node[key] = makePastateStoreToBeReducer(_storeTree[key])
                }
            }
        }
        return combineReducers(node);
    }
    let reduxDevTools = window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()
    let rootStore = createStore(makePastateStoreToBeReducer(storeTree), reduxDevTools)
    if (partXStoreArr.length == 0) {
        storeTree.dispatch = rootStore.dispatch;
    } else {
        partXStoreArr.forEach(xstore => {
            xstore.dispatch = rootStore.dispatch;
        })
    }
    return rootStore;
}

export function makeContainer(component: any, selector?: string | object | Function): any {
    let selectorType = typeof selector;
    let selectFunction;

    if (selector == undefined) {
        selectFunction = state => ({ state: state })
    } else if (selectorType == 'string') {
        selectFunction = state => {
            return {
                state: (selector as string).split('.').reduce((preValue, curValue) => {
                    return preValue[curValue]
                }, state)
            }
        }
    } else if (selectorType == 'object') {
        selectFunction = state => {
            let selectResult = {}
            for (const key in selector as any) {
                if (selector.hasOwnProperty(key)) {
                    selectResult[key] = selector[key].split('.').reduce((preValue, curValue) => {
                        return preValue[curValue]
                    }, state)
                }
            }
            return selectResult
        }
    } else {
        selectFunction = selector
    }
    return connect(selectFunction)(component)
}

export function makeOnlyContainer(component: any, store: any) {
    let RootContainer = makeContainer(component)
    return <Provider store={makeReduxStore(store)}><RootContainer /></Provider>
}

export { Provider as RootContainer }