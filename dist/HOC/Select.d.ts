/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定单选框组件
 */
export default class Select extends React.PureComponent<{
    /** 选项数据数组 */
    options: Array<string> | Array<{
        value: string;
        tag: string;
        disabled?: boolean;
    }>;
    /** 绑定的选中值 */
    value: string;
    /** 传递的 id */
    id?: string;
    /** 传递的 className */
    className?: string;
    /** 指定禁止点击状态，默认为 false */
    disabled?: boolean;
    /** 在绑定值更新后会被调用 */
    afterChange?: (value?: string) => void;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
