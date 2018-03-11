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
/**
 * pastate 双向数据绑定单选框组件
 */
var RadioGroup = /** @class */ (function (_super) {
    __extends(RadioGroup, _super);
    function RadioGroup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onChange = function (e) {
            var store = _this.props.value.__store__;
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component');
            }
            var newValue;
            var optionsTypeName = Object.prototype.toString.call(_this.props.value).slice(8, -1);
            switch (optionsTypeName) {
                case 'String':
                    newValue = e.target.value;
                    break;
                case 'Number':
                    newValue = +e.target.value;
                    break;
                case 'Boolean':
                    newValue = e.target.value == 'true';
                    break;
                default:
                    throw new Error('[pastate] RadioGroup is not support object or array value.');
            }
            store.setSync(_this.props.value, newValue);
            _this.props.afterChange && _this.props.afterChange(newValue);
        };
        return _this;
    }
    RadioGroup.prototype.render = function () {
        var _this = this;
        return (React.createElement("span", { className: this.props.className, id: this.props.id }, this.props.options.map(function (rawOption, index) {
            var optionsTypeName = Object.prototype.toString.call(rawOption).slice(8, -1);
            var option;
            var tag;
            var disabled;
            if (optionsTypeName == "String" || optionsTypeName == "Number" || optionsTypeName == "Boolean") {
                option = rawOption + '';
                tag = rawOption + '';
                disabled = false;
            }
            else {
                option = rawOption.value + '';
                tag = rawOption.tag + '';
                disabled = rawOption.disabled == true;
            }
            _this.props.disabled && (disabled = true);
            var spanClassName = '';
            spanClassName += _this.props.tagClassName || '';
            spanClassName += (disabled && (_this.props.disabledTagClassName && (' ' + _this.props.disabledTagClassName))) || '';
            return (React.createElement("span", { key: index, style: { marginRight: 4, display: _this.props.vertical == true ? "block" : "inline-bock" } },
                React.createElement("input", { type: "radio", checked: _this.props.value + '' == option, value: option, disabled: disabled, onChange: _this.onChange, className: _this.props.radioClassName }),
                React.createElement("span", { className: spanClassName }, tag)));
        })));
    };
    return RadioGroup;
}(React.PureComponent));
exports.default = RadioGroup;
//# sourceMappingURL=RadioGroup.js.map