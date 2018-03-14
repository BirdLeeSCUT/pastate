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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
/**
 * pastate 双向数据绑定复选框组件
 */
var Checkbox = /** @class */ (function (_super) {
    __extends(Checkbox, _super);
    function Checkbox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (e) {
            var store = _this.props.value.__store__;
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
            }
            var newValue = e.target.checked;
            store.currentActionName = '[binding]';
            store.set(_this.props.value, newValue);
            _this.props.afterChange && _this.props.afterChange(newValue);
        };
        return _this;
    }
    Checkbox.prototype.render = function () {
        var props = {
            onChange: this.onChange,
            checked: this.props.value == true,
            disabled: this.props.disabled,
            className: this.props.className,
            id: this.props.id
        };
        return React.createElement("input", __assign({ type: "checkbox" }, props));
    };
    return Checkbox;
}(React.PureComponent));
exports.default = Checkbox;
//# sourceMappingURL=Checkbox.js.map