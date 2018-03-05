/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定复选框组件
 */
export default class Checkbox extends React.PureComponent<{
    /** 绑定的数据值，可直接传入 this.props.state 中的节点值，无需做 state.xxx == true 转化 */
    checked: boolean;
    /** 指定禁止点击状态，默认为 false */
    disabled?: boolean;
    /** 在绑定值更新后会被调用 */
    afterChange?: (newValue?: boolean) => void;
    /** 传递 class 名 ( 用于指定 css 样式等 ) */
    className?: string;
    /** 传递 id 名 ( 用于指定 css 样式等 ) */
    id?: string;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
