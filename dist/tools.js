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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var pastore_1 = require("./pastore");
/**
 * 创建 pastore 的工厂函数
 */
function createStore(initState, actions, middlewares) {
    var store = new pastore_1.XStore(initState);
    if (actions)
        store.actions = actions;
    if (middlewares)
        store.actionMiddlewares = middlewares;
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
 * @param valueProp 原组件的值的属性名称，默认(一般)为 value, 可以根据原组件的情况设为 checked 等
 */
function makeBindable(component, valueProp) {
    var Bind = /** @class */ (function (_super) {
        __extends(Bind, _super);
        function Bind() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onChange = function (newValue) {
                var valueToSet;
                if (newValue.target) {
                    valueToSet = newValue.target[valueProp || _this.props.valueProp || 'value'];
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
                store.sync();
                _this.props.afterChange && _this.props.afterChange(valueToSet);
            };
            return _this;
        }
        Bind.prototype.shouldComponentUpdate = function (nextProps) {
            return nextProps.value != this.props.value;
        };
        Bind.prototype.render = function () {
            if (Array.isArray(this.props.children)) {
                throw new Error('[pastate] you can only give only one child to Bind component');
            }
            var props = Object.assign({}, this.props, (_a = {},
                _a[valueProp || this.props.valueProp || 'value'] = unpack(this.props.value),
                _a.onChange = this.onChange,
                _a));
            return React.createElement(component, props, this.props.children);
            var _a;
        };
        return Bind;
    }(React.Component));
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
//# sourceMappingURL=tools.js.map