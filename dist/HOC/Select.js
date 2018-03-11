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
var Select = /** @class */ (function (_super) {
    __extends(Select, _super);
    function Select() {
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
                    throw new Error('[pastate] Select is not support object or array value.');
            }
            store.set(_this.props.value, newValue);
            _this.props.afterChange && _this.props.afterChange(newValue);
        };
        return _this;
    }
    Select.prototype.render = function () {
        return (React.createElement("select", { className: this.props.className, id: this.props.id, value: this.props.value, disabled: this.props.disabled, onChange: this.onChange }, this.props.options.map(function (rawOption, index) {
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
            return (React.createElement("option", { key: index, value: option, disabled: disabled }, tag));
        })));
    };
    return Select;
}(React.PureComponent));
exports.default = Select;
//# sourceMappingURL=Select.js.map