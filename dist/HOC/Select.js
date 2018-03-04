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
var Select = /** @class */ (function (_super) {
    __extends(Select, _super);
    function Select() {
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
    Select.prototype.render = function () {
        return (React.createElement("select", { className: this.props.className, id: this.props.id, value: this.props.selected, disabled: this.props.disabled, onChange: this.onChange }, this.props.options.map(function (rawOption, index) {
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
            return (React.createElement("option", { key: index, value: option, disabled: disabled }, option));
        })));
    };
    return Select;
}(React.PureComponent));
exports["default"] = Select;
//# sourceMappingURL=Select.js.map