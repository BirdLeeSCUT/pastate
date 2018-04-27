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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pastore_1 = require("./pastore");
/**
 * 创建 pastore 的工厂函数
 */
function createStore(descriptor) {
    var store = new pastore_1.XStore(descriptor.initState);
    store.name = descriptor.name;
    if (descriptor.actions)
        store.actions = descriptor.actions;
    if (descriptor.middlewares)
        store.actionMiddlewares = descriptor.middlewares;
    return store;
}
exports.createStore = createStore;
/**
 * pastate imState 对象拆包
 * @param imValue
 */
function unpack(imValue) {
    var value;
    var valueType = Object.prototype.toString.call(imValue).slice(8, -1);
    switch (valueType) {
        case 'String':
            value = imValue + '';
            break;
        case 'Number':
            value = imValue + 0;
            break;
        case 'Boolean':
            value = imValue == true;
            break;
        case 'Array':
            value = imValue.map(function (ele) { return unpack(ele); });
            break;
        case 'Object':
            value = {};
            for (var key in imValue) {
                if (imValue.hasOwnProperty(key)) {
                    value[key] = unpack(imValue[key]);
                }
            }
            break;
        default: value = imValue;
    }
    return value;
}
exports.unpack = unpack;
/**
 * 把视图组件转为可绑定 value 的组件
 * @param component 原始组件
 * @param _valueProp 原组件的值的属性名称，默认(一般)为 value, 可以根据原组件的情况设为 checked 等
 */
function makeBindable(component, _valueProp) {
    var Bind = /** @class */ (function (_super) {
        __extends(Bind, _super);
        function Bind() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onChange = function (newValue) {
                var valueToSet;
                if (newValue.target) {
                    valueToSet = newValue.target[_valueProp || _this.props.valueProp || 'value'];
                }
                else {
                    valueToSet = newValue;
                }
                var imState = _this.props.value;
                if (imState === null || imState === undefined) {
                    throw new Error('[pastate] The binding value cannot be null or undefined. If you want to support null and undefined, you can use store + bind props.');
                }
                var store = imState.__store__;
                if (!store) {
                    throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
                }
                store.set(imState, valueToSet);
                store.currentActionName = '[binding]';
                store.sync();
                _this.props.afterChange && _this.props.afterChange(valueToSet);
            };
            return _this;
        }
        Bind.prototype.render = function () {
            if (Array.isArray(this.props.children)) {
                throw new Error('[pastate] you can only give only one child to Bind component');
            }
            var _a = this.props, valueProp = _a.valueProp, afterChange = _a.afterChange, parentProps = __rest(_a, ["valueProp", "afterChange"]);
            var props = Object.assign({}, parentProps, (_b = {},
                _b[_valueProp || valueProp || 'value'] = unpack(this.props.value),
                _b.onChange = this.onChange,
                _b));
            return React.createElement(component, props, this.props.children);
            var _b;
        };
        return Bind;
    }(React.PureComponent));
    return Bind;
}
exports.makeBindable = makeBindable;
/**
 * 把一个依赖 imState 的纯函数转化为一个带有缓存功能的纯函数
 */
function makeCacheable(rawFunction) {
    var lastArguments;
    var currentArguments;
    var lastResult;
    var cacheFunction = function () {
        currentArguments = arguments;
        if (lastArguments == undefined || Array.prototype.some.call(lastArguments, function (value, index) {
            return value != currentArguments[index];
        })) {
            lastResult = rawFunction.apply(null, currentArguments);
            lastArguments = currentArguments;
        }
        return lastResult;
    };
    return cacheFunction;
}
exports.makeCacheable = makeCacheable;
/* --- store 内部函数调用门面 --- */
/**
 * 把 imState 转化为响应式 state
 */
function getResponsiveState(state) {
    if (state === null || state == undefined) {
        throw new Error('[Pastate] Can not get responsive state from null or undefined');
    }
    if (!state.__store__) {
        throw new Error('[Pastate] You can only get responsive state from pastate immutable state');
    }
    return state.__store__.getResponsiveState(state);
}
exports.getResponsiveState = getResponsiveState;
/**
 * imState 的 set 操作方法
 */
function set(state, newValue, description) {
    if (!state.__store__) {
        throw new Error('[Pastate] You can only operate pastate immutable state');
    }
    return state.__store__.set(state, newValue, description);
}
exports.set = set;
/**
 * imState 的 merge 操作方法
 */
function merge(state, newValue, description) {
    if (!state.__store__) {
        throw new Error('[Pastate] You can only operate pastate immutable state');
    }
    return state.__store__.merge(state, newValue, description);
}
exports.merge = merge;
/**
 * imState 的 update 操作方法
 */
function update(state, updater, description) {
    if (!state.__store__) {
        throw new Error('[Pastate] You can only operate pastate immutable state');
    }
    return state.__store__.update(state, updater, description);
}
exports.update = update;
//# sourceMappingURL=tools.js.map