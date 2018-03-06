/// <reference types="react" />
import * as React from 'react';
/**
 * pastate 双向数据绑定复选框组件
 * 优点：
 * 1.可以快捷地匿名使用，不用定义新的组件名
 * 2.类型提示完善
 * 缺点:
 * 1. 不便于复用
 * 2. 不是最优运行效率模式
 */
export default class Bind extends React.Component<{
    /** 绑定的值 */
    value: any;
    /** 组件内部使用的指定显示值的属性名 */
    valueProp?: string;
    /** 绑定值改变后进行回调 */
    afterChange?: (newValue: any) => void;
} & Object, any> {
    shouldComponentUpdate(nextProps: any): boolean;
    onChange: (newValue: any) => void;
    render(): React.ReactElement<{
        children?: any;
    }>;
}
