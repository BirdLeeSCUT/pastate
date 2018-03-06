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
function makeBindable(component) {
    var Bind = /** @class */ (function (_super) {
        __extends(Bind, _super);
        function Bind() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.onChange = function (newValue) {
                console.log(newValue);
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
            if (Array.isArray(this.props.children)) {
                throw new Error('[pastate] you can only give only one child to Bind component');
            }
            var props = Object.assign({}, this.props, (_a = {},
                _a[this.props.valueProp || 'value'] = unpack(this.props.value),
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
//# sourceMappingURL=tools.js.map