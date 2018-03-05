/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定单选框组件
 */
export default class RadioGroup extends React.PureComponent<{
    /** 选项数组 */
    options: Array<string> | Array<{
        value: string;
        tag: string;
        disabled?: boolean;
    }>;
    /** 被选择的数据 */
    selected: string;
    disabled?: boolean;
    afterChange?: (value?: string) => void;
    id?: string;
    className?: string;
    radioClassName?: string;
    tagClassName?: string;
    disabledTagClassName?: string;
    vertical?: boolean;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
