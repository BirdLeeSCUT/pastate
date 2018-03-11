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
 * pastate 双向数据绑定输入框组件
 */
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input(props) {
        var _this = _super.call(this, props) || this;
        _this.handleChange = function (e) {
            _this.innerValue = e.target.value;
            _this.forceUpdate();
            if (_this.isComposing == false) {
                _this.updateSourceValue();
            }
        };
        _this.handleCompositionStart = function () {
            if (_this.props.useComposedValue == true) {
                _this.isComposing = true;
            }
        };
        _this.handleCompositionEnd = function () {
            if (_this.props.useComposedValue == true && _this.isComposing) {
                _this.isComposing = false;
                _this.updateSourceValue();
            }
        };
        _this.updateSourceValue = function () {
            var store = _this.props.value.__store__;
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
            }
            var valueTypeName = Object.prototype.toString.call(_this.props.value).slice(8, -1);
            if (_this.props.beforeChange) {
                var oldValue = valueTypeName == 'Number' ? (+_this.props.value) : (_this.props.value + '');
                var result = _this.props.beforeChange(_this.innerValue, oldValue);
                if (result != _this.innerValue) {
                    _this.innerValue = result;
                    _this.forceUpdate();
                }
            }
            store.setSync(_this.props.value, valueTypeName == 'Number' ? (+_this.innerValue) : (_this.innerValue + ''));
            _this.props.afterChange && _this.props.afterChange(_this.innerValue);
        };
        _this.innerValue = _this.props.value + '';
        _this.isComposing = false;
        return _this;
    }
    Input.prototype.componentWillReceiveProps = function (nextProps) {
        this.innerValue = nextProps.value + '';
    };
    Input.prototype.render = function () {
        var props = {
            onChange: this.handleChange,
            type: this.props.type || "text",
            onCompositionStart: this.handleCompositionStart,
            onCompositionEnd: this.handleCompositionEnd,
            value: this.innerValue,
            disabled: this.props.disabled,
            className: this.props.className,
            id: this.props.id
        };
        return this.props.type == "textarea" ?
            React.createElement("textarea", __assign({}, props))
            :
                React.createElement("input", __assign({}, props));
    };
    return Input;
}(React.PureComponent));
exports.default = Input;
//# sourceMappingURL=Input.js.map