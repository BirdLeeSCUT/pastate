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
var tools_1 = require("../tools");
/**
 * pastate 双向数据绑定复选框组件
 * 优点：
 * 1.可以快捷地匿名使用，不用定义新的组件名
 * 2.类型提示完善
 * 缺点:
 * 1. 不便于复用
 * 2. 不是最优运行效率模式
 */
var Bind = /** @class */ (function (_super) {
    __extends(Bind, _super);
    function Bind() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (newValue) {
            var valueToSet;
            if (newValue.target) {
                valueToSet = newValue.target[_this.props.valueProp || 'value'];
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
            store.setSync(imState, valueToSet);
            _this.props.afterChange && _this.props.afterChange(valueToSet);
        };
        return _this;
    }
    Bind.prototype.shouldComponentUpdate = function (nextProps) {
        return nextProps.value != this.props.value;
    };
    Bind.prototype.render = function () {
        var element = this.props.children;
        console.log(element);
        if (Array.isArray(element)) {
            if (element.length == 1) {
                element = element[0];
            }
            else {
                throw new Error('[pastate] you can only give only one child to Bind component');
            }
        }
        var component = element.type;
        var props = Object.assign({}, this.props, element.props, (_a = {},
            _a[this.props.valueProp || 'value'] = tools_1.unpack(this.props.value),
            _a.onChange = this.onChange,
            _a));
        return React.createElement(component, props, element.props.children);
        var _a;
    };
    return Bind;
}(React.Component));
exports.default = Bind;
//# sourceMappingURL=Bind.js.map