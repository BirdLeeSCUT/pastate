"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var React = require("react");
var redux_1 = require("redux");
var react_redux_1 = require("react-redux");
exports.RootContainer = react_redux_1.Provider;
var XBoolean = (function (_super) {
    __extends(XBoolean, _super);
    function XBoolean() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XBoolean;
}(Boolean));
exports.XBoolean = XBoolean;
var XNumber = (function (_super) {
    __extends(XNumber, _super);
    function XNumber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XNumber;
}(Number));
exports.XNumber = XNumber;
var XString = (function (_super) {
    __extends(XString, _super);
    function XString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XString;
}(String));
exports.XString = XString;
var XArray = (function (_super) {
    __extends(XArray, _super);
    function XArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XArray;
}(Array));
exports.XArray = XArray;
var XObject = (function (_super) {
    __extends(XObject, _super);
    function XObject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return XObject;
}(Object));
exports.XObject = XObject;
var XStore = (function () {
    function XStore(initState, config) {
        this.__PASTATE_STORE__ = true;
        this.name = 'anonymous component';
        this.isQueuingOperations = false;
        this.pendingOperationQueue = [];
        this.config = {
            useSpanNumber: true
        };
        config && (Object.assign(this.config, config));
        this.imState = this.toXType(initState, '');
        this.state = this.makeRState([]);
        this.preState = this.imState;
    }
    XStore.prototype.makeRState = function (path, newValue) {
        var _this = this;
        var node;
        if (newValue) {
            var newValueTypeName = Object.prototype.toString.call(node).slice(8, -1);
            switch (newValueTypeName) {
                case 'Object':
                    node = __assign({}, newValue);
                    break;
                case 'Array':
                    node = newValue.slice();
                    break;
                default: node = newValue;
            }
        }
        else {
            node = XStore.getValueByPath(this.imState, path);
        }
        var typeName = Object.prototype.toString.call(node).slice(8, -1);
        var rnode;
        if (typeName == 'Object') {
            rnode = {};
        }
        else if (typeName == 'Array') {
            rnode = [];
            var context_1 = this;
            Object.defineProperty(rnode, 'push', {
                enumerable: false,
                get: function () {
                    return function (element) {
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) { return arr.concat([element]); });
                        var rValue = context_1.makeRState(path.concat([rnode.length]), element);
                        Object.defineProperty(rnode, rnode.length, {
                            enumerable: true,
                            configurable: true,
                            get: function () {
                                return rValue;
                            },
                            set: function (_newValue) {
                                context_1.set(XStore.getValueByPath(context_1.imState, path)[rnode.length], _newValue);
                            }
                        });
                    };
                }
            });
            Object.defineProperty(rnode, 'pop', {
                enumerable: false,
                get: function () {
                    return function () {
                        if (rnode.length <= 0) {
                            return null;
                        }
                        var lastOneIndex = rnode.length - 1;
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) { return arr.slice(0, lastOneIndex); });
                        delete rnode[lastOneIndex];
                        rnode.length -= 1;
                        return XStore.getValueByPath(context_1.imState, path)[lastOneIndex];
                    };
                }
            });
            Object.defineProperty(rnode, 'unshift', {
                enumerable: false,
                get: function () {
                    return function (element) {
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) { return [element].concat(arr); });
                        var rValue = context_1.makeRState(path.concat([rnode.length]), element);
                        Object.defineProperty(rnode, rnode.length, {
                            enumerable: true,
                            configurable: true,
                            get: function () {
                                return rValue;
                            },
                            set: function (_newValue) {
                                context_1.set(XStore.getValueByPath(context_1.imState, path)[rnode.length], _newValue);
                            }
                        });
                    };
                }
            });
            Object.defineProperty(rnode, 'shift', {
                enumerable: false,
                get: function () {
                    return function () {
                        if (rnode.length <= 0) {
                            return null;
                        }
                        var lastOneIndex = rnode.length - 1;
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) { return arr.slice(1); });
                        delete rnode[lastOneIndex];
                        rnode.length -= 1;
                        var targetArray = XStore.getValueByPath(context_1.imState, path);
                        return targetArray[targetArray.length - rnode.length - 1];
                    };
                }
            });
            Object.defineProperty(rnode, 'splice', {
                enumerable: false,
                get: function () {
                    return function (start, deleteCount, newElement) {
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) {
                            arr.splice(start, deleteCount, newElement);
                            return arr;
                        });
                        var lastOneIndex = rnode.length - 1;
                        for (var i = 0; i < deleteCount - (newElement !== undefined ? 1 : 0); i++) {
                            delete rnode[lastOneIndex - i];
                        }
                        rnode.length -= (deleteCount - (newElement !== undefined ? 1 : 0));
                        var targetArray = XStore.getValueByPath(context_1.imState, path);
                        return targetArray.slice(start, start + deleteCount);
                    };
                }
            });
            Object.defineProperty(rnode, 'sort', {
                enumerable: false,
                get: function () {
                    return function (compareFunction) {
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) { return arr.sort(compareFunction); });
                        return XStore.getValueByPath(context_1.imState, path);
                    };
                }
            });
            Object.defineProperty(rnode, 'reverse', {
                enumerable: false,
                get: function () {
                    return function () {
                        context_1.update(XStore.getValueByPath(context_1.imState, path), function (arr) { return arr.reverse(); });
                        return XStore.getValueByPath(context_1.imState, path);
                    };
                }
            });
        }
        else {
            throw new Error('updateRState meet not object value, this is an error of pastate, typeName: ' + typeName);
        }
        var _loop_1 = function (prop) {
            if (node.hasOwnProperty(prop) && prop != '__xpath__') {
                var valueTypeName_1 = Object.prototype.toString.call(node[prop]).slice(8, -1);
                if (valueTypeName_1 == 'Object' || valueTypeName_1 == 'Array') {
                    var rValue_1 = this_1.makeRState(path.concat([prop]), node[prop]);
                    Object.defineProperty(rnode, prop, {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            var valueToGet = XStore.getValueByPath(_this.imState, path)[prop];
                            if (valueToGet === null || valueToGet === undefined) {
                                return valueToGet;
                            }
                            else {
                                return rValue_1;
                            }
                        },
                        set: function (_newValue) {
                            if (_newValue === null || _newValue === undefined) {
                                console.warn("[pastate] You are setting an " + valueTypeName_1 + " node to be '" + _newValue + "', which is deprecated.");
                            }
                            var valueToSet = XStore.getValueByPath(_this.imState, path)[prop];
                            if (valueToSet === null || valueToSet === undefined) {
                                _this.merge({ __xpath__: path.map(function (p) { return '.' + p; }).join('') }, (_a = {},
                                    _a[prop] = _newValue,
                                    _a));
                            }
                            else {
                                _this.set(valueToSet, _newValue);
                            }
                            if (valueTypeName_1 == 'Array') {
                                rValue_1 = _this.makeRState(path.concat([prop]), _newValue);
                            }
                            var _a;
                        }
                    });
                }
                else {
                    Object.defineProperty(rnode, prop, {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            var getValue = XStore.getValueByPath(_this.imState, path)[prop];
                            if (getValue === null || getValue === undefined) {
                                return getValue;
                            }
                            switch (valueTypeName_1) {
                                case 'Number': return +getValue;
                                case 'Boolean': return getValue == true;
                                case 'String': return getValue + '';
                                default: return getValue;
                            }
                        },
                        set: function (_newValue) {
                            var newValueTypeName = Object.prototype.toString.call(_newValue).slice(8, -1);
                            if (newValueTypeName == 'Array' || newValueTypeName == 'Object') {
                                console.error('[pastate] At present, you cannot set an node with the string | number | boolean | null | undefined value to be Array or Object. We will consider support it in the future.');
                                return;
                            }
                            var valueToSet = XStore.getValueByPath(_this.imState, path)[prop];
                            if (valueToSet === null || valueToSet === undefined) {
                                _this.merge({ __xpath__: path.map(function (p) { return '.' + p; }).join('') }, (_a = {},
                                    _a[prop] = _newValue,
                                    _a));
                            }
                            else {
                                _this.set(valueToSet, _newValue);
                            }
                            var _a;
                        }
                    });
                }
            }
        };
        var this_1 = this;
        for (var prop in node) {
            _loop_1(prop);
        }
        return rnode;
    };
    XStore.prototype.getResponsiveState = function (imState) {
        var pathArr;
        if (imState.__xpath__ === undefined) {
            throw new Error('[pastate] getResponsiveState: you shuold give an imState node');
        }
        else if (imState.__xpath__ == '') {
            pathArr = [];
        }
        else {
            pathArr = imState.__xpath__.split('.');
            pathArr.shift();
        }
        return XStore.getValueByPath(this.state, pathArr);
    };
    XStore.prototype.set = function (stateToOperate, newValue, description) {
        this.submitOperation({
            operate: 'set',
            stateToOperate: stateToOperate,
            payload: newValue,
            description: description
        });
        return this;
    };
    XStore.prototype.setNew = function (literalPath, newValue, description) {
        if (typeof literalPath != 'string') {
            throw new Error('[store.setNew] literalPath can only be string');
        }
        this.submitOperation({
            operate: 'set',
            stateToOperate: {
                __xpath__: literalPath
            },
            payload: newValue,
            description: description
        });
        return this;
    };
    XStore.prototype.setSync = function (state, newValue) {
        var pathArr = state.__xpath__.split('.');
        pathArr.shift();
        var endPath = pathArr.pop();
        var fatherValue = this.getNewReference(pathArr);
        fatherValue[Array.isArray(fatherValue) ? (endPath - 0) : endPath] = this.toXType(newValue, state.__xpath__);
        this.forceUpdate();
        return this;
    };
    XStore.prototype.merge = function (stateToOperate, newValue, description) {
        this.submitOperation({
            operate: 'merge',
            stateToOperate: stateToOperate,
            payload: newValue,
            description: description
        });
        return this;
    };
    XStore.prototype.update = function (stateToOperate, updater, description) {
        this.submitOperation({
            operate: 'update',
            stateToOperate: stateToOperate,
            payload: updater,
            description: description
        });
        return this;
    };
    XStore.prototype.submitOperation = function (rawParams) {
        if (rawParams.stateToOperate === undefined || rawParams.stateToOperate === null) {
            console.warn('Opertion can only perform operation using `path inferrence` when the state is not undefined or null state.');
            console.warn('`stateToOperate` is given ', rawParams.stateToOperate, ', please checkout are there some errors in `stateToOperate`. If not, try below:');
            console.warn('There are some ways to go, choose one as you like:');
            console.warn('- Use `setNew` instead: for example, this.setNew(\'this.imState.propThatIsNull\', ...)');
            console.warn('- If you want to use operation with path inferrence from, you should use {}, \'\', NaN to be the initial value, and do not set any state value to be undefined or null');
            if (rawParams.operate == 'set') {
                console.warn('- You also can use `merge` operation to set the new value into the state that is having undefined or null value.');
            }
            if (rawParams.operate == 'update') {
                console.warn('- If you want to update a state without using present it`s value, it is no need to use `update` operation, please use `set` or `merge` instead.');
            }
            throw new Error("[Error store." + rawParams.operate + "] `stateToOperate` is undefined or null.");
        }
        var path = '';
        if (typeof rawParams.stateToOperate.__xpath__ == 'string') {
            path = rawParams.stateToOperate.__xpath__;
        }
        else {
            throw new Error("[Error store." + rawParams.operate + "] `stateToOperate` has no string __xpath__");
        }
        var payloadType = Object.prototype.toString.call(rawParams.payload).slice(8, -1);
        if (payloadType == 'Undefined' || payloadType == 'Null') {
            console.warn("[pastate] You are making " + path + " to be `undefined` or `null`, which is deprecated.");
        }
        this.tryPushOperation({
            operation: rawParams.operate,
            path: path,
            payload: rawParams.payload,
            description: rawParams.description
        });
    };
    XStore.prototype.setOperationMarker = function (description) {
        this.tryPushOperation({
            operation: 'mark',
            description: description
        });
    };
    XStore.prototype.tryPushOperation = function (operation) {
        var _this = this;
        if (this.stateWillAddOperation(operation)) {
            if (!this.isQueuingOperations) {
                this.isQueuingOperations = true;
                setTimeout(function () {
                    if (_this.isQueuingOperations == true) {
                        _this.isQueuingOperations = false;
                        _this.beginReduceOpertions();
                    }
                }, 0);
            }
            this.pendingOperationQueue.push(operation);
        }
        else {
            console.info('[Error store.tryPushOperation] Operation pushing is canceled.');
        }
    };
    XStore.prototype.beginReduceOpertions = function () {
        var _this = this;
        if (!this.stateWillReduceOperations()) {
            console.info('Operations reducing has been canceled at beginning!');
            return;
        }
        var loadingOperationQueue = this.pendingOperationQueue;
        this.pendingOperationQueue = [];
        this.preState = this.imState;
        var hadRan = 0;
        var tookEffect = 0;
        var isDone = false;
        try {
            isDone = loadingOperationQueue.every(function (operation, index) {
                if (!_this.stateWillApplyOperation(index)) {
                    console.info("Operations reducing has been canceled at " + index + "!", operation);
                    return false;
                }
                var result = _this.applyOperation(operation);
                if (!result.isMarker)
                    hadRan += 1;
                if (result.tookEffect)
                    tookEffect += 1;
                if (!_this.stateDidAppliedOperation({
                    index: index,
                    tookEffect: result.tookEffect,
                    oldValue: result.oldValue
                })) {
                    console.info("Operations reducing has been stop after " + index + "!", operation);
                    return false;
                }
                return true;
            });
        }
        catch (e) {
            console.error('[XStore] Operation reduction is terminated: ' + e.message);
        }
        if (this.dispatch) {
            this.dispatch({
                type: '__PASTORE_UPDATE__: ' + (this.name || '(you can add a name to your xstore via name prop)')
            });
        }
        else {
        }
        this.stateDidReducedOperations({
            isDone: isDone,
            all: loadingOperationQueue.length,
            realOperation: loadingOperationQueue.filter(function (v) { return v.operation != 'mark'; }).length,
            hadRan: hadRan,
            tookEffect: tookEffect
        });
    };
    XStore.prototype.forceUpdate = function () {
        if (this.imState == this.preState) {
            this.imState = __assign({}, this.imState);
        }
        this.preState = this.imState;
        if (this.dispatch) {
            this.dispatch({
                type: '__XSTORE_FORCE_UPDATE__: ' + (this.name || '(you can add a name to your xstore via name prop)')
            });
        }
        else {
            console.error('[XStore] dispatch method is not injected');
        }
    };
    XStore.prototype.setTextValue = function (state, newValue) {
        if (state.__xpath__) {
            this.setSync(state, newValue);
        }
        else {
            state = newValue;
            this.beginReduceOpertions();
        }
    };
    XStore.prototype.sync = function () {
        this.beginReduceOpertions();
    };
    XStore.prototype.applyOperation = function (operation) {
        if (operation.operation == 'mark') {
            console.log("[Operation Marker]  ----------- " + operation.description + " ----------- ");
            return {
                isMarker: true,
                oldValue: this.imState,
                tookEffect: false
            };
        }
        var pathArr = operation.path.split('.');
        pathArr.shift();
        var endPath;
        var fatherNode;
        var newValue;
        var payload = operation.payload;
        var preValue = XStore.getValueByPath(this.preState, pathArr);
        var valueType = Object.prototype.toString.call(preValue).slice(8, -1);
        if (operation.operation == 'set') {
            if (payload == preValue) {
                if (valueType == 'Array') {
                    payload = payload.slice();
                }
                else if (valueType == 'Object') {
                    payload = __assign({}, payload);
                }
                else {
                    return {
                        isMarker: false,
                        oldValue: this.preState,
                        tookEffect: false
                    };
                }
            }
            if (pathArr.length == 0) {
                this.imState = this.toXType(payload, operation.path);
                console.info('[set] You are setting the entire state, please check if you really want to do it.');
            }
            else {
                endPath = pathArr.pop();
                fatherNode = this.getNewReference(pathArr);
                fatherNode[Array.isArray(fatherNode) ? [endPath - 0] : endPath] = this.toXType(payload, operation.path);
            }
            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true
            };
        }
        else if (operation.operation == 'merge') {
            if (valueType != 'Object') {
                throw new Error('[merge] You can only apply `merge` operation on an object');
            }
            if (Object.prototype.toString.call(payload).slice(8, -1) != 'Object') {
                throw new Error('[merge] You can only apply `merge` operation with an object payload');
            }
            fatherNode = this.getNewReference(pathArr);
            for (var key in payload) {
                if (key != '__xpath__') {
                    fatherNode[key] = this.toXType(payload[key], operation.path + '.' + key);
                }
            }
            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true
            };
        }
        else if (operation.operation == 'update') {
            var oldValue = XStore.getValueByPath(this.imState, pathArr);
            if (oldValue === preValue) {
                if (valueType == 'Array') {
                    oldValue = oldValue.slice();
                }
                else if (valueType == 'Object') {
                    oldValue = __assign({}, oldValue);
                }
            }
            newValue = operation.payload(oldValue);
            var newXTypeValue = this.toXType(newValue, operation.path);
            if (pathArr.length == 0) {
                this.imState = newXTypeValue;
            }
            else {
                endPath = pathArr.pop();
                fatherNode = this.getNewReference(pathArr);
                fatherNode[Array.isArray(fatherNode) ? [endPath - 0] : endPath] = newXTypeValue;
            }
            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true
            };
        }
        else {
            throw new Error('[XStore] operation invalid!');
        }
    };
    XStore.getValueByPath = function (rootObj, pathArr) {
        return pathArr.reduce(function (preValue, curPath) { return preValue[Array.isArray(preValue) ? (curPath - 0) : curPath]; }, rootObj);
    };
    XStore.prototype.getNewReference = function (pathArr) {
        pathArr = pathArr.slice();
        var curValue = XStore.getValueByPath(this.imState, pathArr);
        var preValue = XStore.getValueByPath(this.preState, pathArr);
        if (curValue == preValue) {
            curValue = Array.isArray(preValue) ? preValue.slice() : __assign({}, preValue);
            Object.defineProperty(curValue, "__xpath__", {
                enumerable: false,
                value: preValue.__xpath__,
                writable: true
            });
            if (pathArr.length == 0) {
                this.imState = curValue;
            }
            else {
                var endPath = pathArr.pop();
                var fatherValue = this.getNewReference(pathArr.slice());
                fatherValue[Array.isArray(fatherValue) ? (endPath - 0) : endPath] = curValue;
            }
        }
        return curValue;
    };
    XStore.prototype.toXType = function (rawData, path) {
        var _this = this;
        if (rawData === undefined) {
            return undefined;
        }
        if (rawData === null) {
            return null;
        }
        var xNewData;
        var typeName = Object.prototype.toString.call(rawData).slice(8, -1);
        if (rawData.__xpath__ === undefined) {
            switch (typeName) {
                case 'Boolean':
                    xNewData = new Boolean(rawData);
                    break;
                case 'Number':
                    xNewData = new Number(rawData);
                    this.config.useSpanNumber && Object.assign(xNewData, React.createElement("span", null, +rawData));
                    break;
                case 'String':
                    xNewData = new String(rawData);
                    break;
                case 'Array':
                    xNewData = new Array(rawData);
                    xNewData = rawData.map(function (value, index) {
                        return _this.toXType(value, path + '.' + index);
                    });
                    break;
                case 'Object':
                    xNewData = new XObject(rawData);
                    for (var prop in xNewData) {
                        if (xNewData.hasOwnProperty(prop) && prop != '__xpath__') {
                            rawData[prop] = this.toXType(rawData[prop], path + '.' + prop);
                        }
                    }
                    break;
                default:
                    console.error('[XStore] XType transform error:', typeName);
                    xNewData = new XObject(undefined);
            }
            Object.defineProperty(xNewData, "__xpath__", {
                value: path,
                enumerable: false,
                writable: true
            });
            if (xNewData.__store__ === undefined) {
                Object.defineProperty(xNewData, "__store__", {
                    value: this,
                    enumerable: false,
                    writable: false
                });
            }
        }
        else {
            xNewData = rawData;
            if (xNewData.__xpath__ != path) {
                xNewData.__xpath__ = path;
                switch (typeName) {
                    case 'Array':
                        xNewData = rawData.map(function (value, index) {
                            return _this.toXType(value, path + '.' + index);
                        });
                        break;
                    case 'Object':
                        for (var prop in xNewData) {
                            if (xNewData.hasOwnProperty(prop) && prop != '__xpath__') {
                                rawData[prop] = this.toXType(rawData[prop], path + '.' + prop);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return xNewData;
    };
    XStore.prototype.stateWillAddOperation = function (operation) {
        return true;
    };
    XStore.prototype.stateWillReduceOperations = function () {
        return true;
    };
    XStore.prototype.stateWillApplyOperation = function (operationIndex) {
        return true;
    };
    XStore.prototype.stateDidAppliedOperation = function (info) {
        return true;
    };
    XStore.prototype.stateDidReducedOperations = function (stats) {
        return true;
    };
    XStore.prototype.getReduxReducer = function () {
        var _this = this;
        return function () { return _this.imState; };
    };
    XStore.prototype.syncInput = function (state) {
        var _this = this;
        return function (event) {
            _this.setSync(state, event.target.value);
        };
    };
    return XStore;
}());
exports.XStore = XStore;
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
var Input_1 = require("./HOC/Input");
exports.Input = Input_1["default"];
var Checkbox_1 = require("./HOC/Checkbox");
exports.Checkbox = Checkbox_1["default"];
var Radiobox = (function (_super) {
    __extends(Radiobox, _super);
    function Radiobox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (e) {
            var store = _this.props.selected.__store__;
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
            }
            store.setSync(_this.props.selected, e.target.value);
            _this.props.onChange && _this.props.onChange(e.target.value);
        };
        return _this;
    }
    Radiobox.prototype.render = function () {
        var _this = this;
        return (React.createElement("span", { className: this.props.className, id: this.props.id }, this.props.options.map(function (rawOption, index) {
            var optionsTypeName = Object.prototype.toString.call(rawOption).slice(8, -1);
            var option;
            var disabled;
            if (optionsTypeName == "String") {
                option = rawOption;
                disabled = false;
            }
            else {
                option = rawOption.value;
                disabled = rawOption.disabled == true;
            }
            var spanClassName = '';
            spanClassName += _this.props.tagClassName || '';
            spanClassName += (disabled && (_this.props.disabledTagClassName && (' ' + _this.props.disabledTagClassName))) || '';
            return (React.createElement("span", { key: index, style: { marginRight: 6, display: _this.props.vertical == true ? "block" : "inline-bock" } },
                React.createElement("input", { type: "radio", checked: _this.props.selected == option, value: option, disabled: disabled, onChange: _this.onChange, className: _this.props.radioClassName }),
                React.createElement("span", { className: spanClassName }, option)));
        })));
    };
    return Radiobox;
}(React.PureComponent));
exports.Radiobox = Radiobox;
var Select = (function (_super) {
    __extends(Select, _super);
    function Select() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (e) {
            var store = _this.props.selected.__store__;
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
            }
            store.setSync(_this.props.selected, e.target.value);
        };
        return _this;
    }
    Select.prototype.render = function () {
        var _this = this;
        return (React.createElement("span", { className: this.props.className, id: this.props.id }, this.props.options.map(function (option, index) {
            return React.createElement("span", { key: index, style: { marginRight: 6, display: _this.props.vertical == true ? "block" : "inline-bock" } },
                React.createElement("input", { type: "radio", checked: _this.props.selected == option, value: option, onChange: _this.onChange }),
                React.createElement("span", __assign({}, _this.props.tagProps), option));
        })));
    };
    return Select;
}(React.PureComponent));
exports.Select = Select;
