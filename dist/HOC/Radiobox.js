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
exports.__esModule = true;
var React = require("react");
/**
 * pastate 双向数据绑定单选框组件
 */
var Radiobox = /** @class */ (function (_super) {
    __extends(Radiobox, _super);
    function Radiobox() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (e) {
            var store = _this.props.selected.__store__;
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
            }
            store.setSync(_this.props.selected, e.target.value);
            _this.props.afterChange && _this.props.afterChange(e.target.value);
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
            return (React.createElement("span", { key: index, style: { marginRight: 4, display: _this.props.vertical == true ? "block" : "inline-bock" } },
                React.createElement("input", { type: "radio", checked: _this.props.selected == option, value: option, disabled: disabled, onChange: _this.onChange, className: _this.props.radioClassName }),
                React.createElement("span", { className: spanClassName }, option)));
        })));
    };
    return Radiobox;
}(React.PureComponent));
exports["default"] = Radiobox;
//# sourceMappingURL=Radiobox.js.map