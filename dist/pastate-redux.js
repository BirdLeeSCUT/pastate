"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
exports.RootContainer = react_redux_1.Provider;
function makeReduxStore(storeTree) {
    var partXStoreArr = [];
    var makePastateStoreToBeReducer = function (_storeTree) {
        if (_storeTree.__PASTATE_STORE__) {
            return _storeTree.getReduxReducer();
        }
        var node = {};
        for (var key in _storeTree) {
            if (_storeTree.hasOwnProperty(key)) {
                if (_storeTree[key].__PASTATE_STORE__) {
                    node[key] = _storeTree[key].getReduxReducer();
                    partXStoreArr.push(_storeTree[key]);
                }
                else {
                    node[key] = makePastateStoreToBeReducer(_storeTree[key]);
                }
            }
        }
        return redux_1.combineReducers(node);
    };
    var reduxDevTools = window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']();
    var rootStore = redux_1.createStore(makePastateStoreToBeReducer(storeTree), reduxDevTools);
    if (partXStoreArr.length == 0) {
        storeTree.dispatch = rootStore.dispatch;
    }
    else {
        partXStoreArr.forEach(function (xstore) {
            xstore.dispatch = rootStore.dispatch;
        });
    }
    return rootStore;
}
exports.makeReduxStore = makeReduxStore;
function makeContainer(component, selector) {
    var selectorType = typeof selector;
    var selectFunction;
    if (selector == undefined) {
        selectFunction = function (state) { return ({ state: state }); };
    }
    else if (selectorType == 'string') {
        selectFunction = function (state) {
            return {
                state: selector.split('.').reduce(function (preValue, curValue) {
                    return preValue[curValue];
                }, state)
            };
        };
    }
    else if (selectorType == 'object') {
        selectFunction = function (state) {
            var selectResult = {};
            for (var key in selector) {
                if (selector.hasOwnProperty(key)) {
                    selectResult[key] = selector[key].split('.').reduce(function (preValue, curValue) {
                        return preValue[curValue];
                    }, state);
                }
            }
            return selectResult;
        };
    }
    else {
        selectFunction = selector;
    }
    return react_redux_1.connect(selectFunction)(component);
}
exports.makeContainer = makeContainer;
function makeOnlyContainer(component, store) {
    var RootContainer = makeContainer(component);
    return React.createElement(react_redux_1.Provider, { store: makeReduxStore(store) },
        React.createElement(RootContainer, null));
}
exports.makeOnlyContainer = makeOnlyContainer;
//# sourceMappingURL=pastate-redux.js.map