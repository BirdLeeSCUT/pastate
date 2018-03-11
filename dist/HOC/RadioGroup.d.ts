/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定单选框组件
 */
export default class RadioGroup extends React.PureComponent<{
    /** 选项数组 */
    options: Array<string | number | boolean> | Array<{
        value: string | number | boolean;
        tag: string;
        disabled?: boolean;
    }>;
    /** 绑定的选中值 */
    value: string | number | boolean;
    /** 指定禁止选择状态，默认为 false */
    disabled?: boolean;
    /** 在绑定值更新后会被调用 */
    afterChange?: (value?: string | number | boolean) => void;
    /** 传递给选项组根元素的 id */
    id?: string;
    /** 传递给选项组根元素的 className */
    className?: string;
    /** 传递给圆形按钮的 className */
    radioClassName?: string;
    /** 传递给选项标签的 className */
    tagClassName?: string;
    /** 传递给禁用状态的选项标签的**附加**的 className */
    disabledTagClassName?: string;
    /** 指定为垂直排列状态，默认为 false */
    vertical?: boolean;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
