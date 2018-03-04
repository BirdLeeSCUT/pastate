/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定复选框组件
 */
export default class Checkbox extends React.PureComponent<{
    /** 组件值 */
    checked: boolean;
    disabled?: boolean;
    afterChange?: (newValue?: boolean) => void;
    className?: string;
    id?: string;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
