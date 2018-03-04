/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定输入框组件
 */
export default class Input extends React.PureComponent<{
    /** 文本值 */
    value: string;
    /** 输入框类型, 默认为 text */
    type?: "text" | "textarea" | "password" | "number";
    /**
     * 在文本值更新会被调用，可用于实现自定义更新逻辑
     * @param newValue 将更新的新值
     * @param oldValue 原始值
     * @returns {string} 返回实际要更新的值
     */
    beforeChange?: (newValue?: string, oldValue?: string) => string;
    afterChange?: (newValue?: string) => void;
    disabled?: boolean;
    /** [实验特性] 指定是否开启输入法输入完成才更新 state 的模式，默认为关闭 */
    useComposedValue?: boolean;
    className?: string;
    id?: string;
}, any> {
    constructor(props: any);
    private innerValue;
    private isComposing;
    handleChange: (e: any) => void;
    handleCompositionStart: () => void;
    handleCompositionEnd: () => void;
    updateSourceValue: () => void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
}
