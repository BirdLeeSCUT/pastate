/// <reference types="react" />
import * as React from 'react';
import { Store } from 'redux';
import { Dispatch, Provider } from 'react-redux';
export interface XType {
    __xpath__?: string;
    __store__?: XStore<any>;
}
export declare class XBoolean extends Boolean implements XType {
    __xpath__: string;
    __store__: XStore<any>;
}
export declare class XNumber extends Number implements XType {
    __xpath__: string;
    __store__: XStore<any>;
}
export declare class XString extends String implements XType {
    __xpath__: string;
    __store__: XStore<any>;
}
export declare class XArray extends Array<any> implements XType {
    __xpath__: string;
    __store__: XStore<any>;
}
export interface XOperation {
    operation: 'set' | 'merge' | 'update' | 'mark';
    path?: string;
    payload?: any;
    description?: string;
}
export declare class XObject extends Object implements XType {
    __xpath__: string;
    __store__: XStore<any>;
}
export declare class XStore<State extends XType> {
    __PASTATE_STORE__: boolean;
    /**
     * 制定当前 store 的名称，可选
     */
    name: string;
    /**
     * immutable state 对象
     */
    imState: State;
    /**
     * 响应式 state
     */
    state: State;
    /**
     * 执行 operation 操作前暂存的 state 值
     */
    preState: State;
    /**
     * dispatch 函数，待注入
     */
    dispatch: Dispatch<any>;
    /**
     * 表示是否正在累积操作
     */
    isQueuingOperations: boolean;
    /**
     * 待执行的 operation 列表.
     * 把 operation 累积起来再一起执行，可以实现一些基于多 operation 的中间件，具有较多的可操作性
     */
    pendingOperationQueue: Array<XOperation>;
    actions: {
        [key: string]: Function;
    };
    mutations: {
        [key: string]: Function;
    };
    config: {
        useSpanNumber: boolean;
    };
    /**
     * 构造state
     * @param initState
     * @param createElement 可选，如果注入，数字可以直接渲染
     */
    constructor(initState: State, config?: {
        useSpanNumber?: boolean;
    });
    private makeRState(path, newValue?);
    getResponsiveState(imState: XType): any;
    /**
     * ### 对 state 进行 set 操作
     * @param stateToOperate
     * @param newValue : T | null , FIXME: 引入 Xtype 的 null 对象后， 可把 null 取消掉
     * @param description
     * @return this 以支持链式调用
     */
    set<T>(stateToOperate: T, newValue: T, description?: string): XStore<State>;
    /**
     * set 设置新属性的版本
     * // TODO 待改为 setByPath
     * 当现值为 null 或 undefined 时需要用此方法
     * @argument literalPath 路径，如 ''(root) , '.prop1', '.prop1.prop2'
     */
    setNew(literalPath: string, newValue: any, description?: string): XStore<State>;
    /**
     * 同步版本的 set
     * 用户表单输入的更新
     */
    setSync(state: any, newValue: any): XStore<State>;
    /**
     * ### 对 state 进行 merge 操作
     * 进行的是浅层 merge
     * // TODO: 待研究 deep merge 的必要性
     * @param stateToOperate
     * @param newValue
     * @param description
     */
    merge<T>(stateToOperate: T, newValue: Partial<T>, description?: string): XStore<State>;
    /**
     * ### 对 state 进行 update 操作
     * // TODO 待写使用说明
     * - 如果 `state` 是 `boolean | number | string`, ...
     * - 如果 `state` 是 `array`, ...
     * - 如果 `state` 是 `object`, ...
     * @param stateToOperate
     * @param updater
     * @param description
     */
    update<T>(stateToOperate: T, updater: (value: T) => T, description?: string): XStore<State>;
    /**
     * 底层operation提交函数
     * 检查提交参数，如果合法，把操作提交到待执行操作列表
     */
    private submitOperation(rawParams);
    /**
     * 设置 operation 描述型分割线，可以再执行 operation 时输出
     */
    setOperationMarker(description: string): void;
    /**
     * 尝试把 operation 加入到 pendding 队列
     */
    private tryPushOperation(operation);
    /**
     * operations 队列处理启动函数
     * // TO TEST
     */
    beginReduceOpertions(): void;
    forceUpdate(): void;
    /**
     * 当更新输入当前计划的输入值
     * @param state
     * @param newValue
     */
    setTextValue(state: any, newValue: any): void;
    /**
     * 手动地对应用state进行更新
     */
    sync(): void;
    /**
     * operation 项处理器，负责 imState = imState + operation 的逻辑
     * @throws 但执行失败时直接抛出异常
     * @returns object
     */
    private applyOperation(operation);
    /**
     * 通过路径获取 state 中的值
     * // Basic Tested
     * @param path
     */
    static getValueByPath(rootObj: any, pathArr: Array<string>): any;
    /**
     * 溯源性地更新节点的引用对象并返回
     * @param pathArr
     * @return 更新后的节点的值
     */
    getNewReference(pathArr: Array<string>): XType;
    /**
     * 实现普通类型到 XType 类型的转化
     */
    toXType(rawData: any, path: string): XType | undefined | null;
    /**
     * 生命周期函数：将要增加 operation 时会被调用
     * @param operate
     * @returns boolean 表示是否继续执行后续操作
     */
    stateWillAddOperation(operation: XOperation): boolean;
    /**
     * 生命周期函数：将要执行 operations 时会被调用
     * @returns boolean 表示是否继续执行后续操作
     */
    stateWillReduceOperations(): boolean;
    /**
     * 生命周期函数：将要执行一个 operation 时会被调用
     * @param operationIndex operations 中的索引号
     * @returns boolean 表示是否继续执行后续操作
     */
    stateWillApplyOperation(operationIndex: number): boolean;
    /**
     * 生命周期函数：执行完一个 operation 后会被调用
     * @param info object
     *  - index 表示 operations 中的索引号
     *  - tookEffect 表示这个 operation 是否对 state 产生修改作用
     *  - oldValue 执行这个操作前的 state
     * @returns boolean 表示是否继续执行后续操作
     */
    stateDidAppliedOperation(info: {
        index: number;
        tookEffect: boolean;
        oldValue: any;
    }): boolean;
    /**
     * 生命周期函数：执行完 operations 时执行
     * @returns boolean 表示是否继续执行后续操作
     */
    stateDidReducedOperations(stats: {
        isDone: boolean;
        all: number;
        realOperation: number;
        hadRan: number;
        tookEffect: number;
    }): boolean;
    getReduxReducer(): () => State;
    syncInput(state: any): (event: React.ChangeEvent<any>) => void;
}
export declare function makeReduxStore(storeTree: any): Store<any>;
export declare function makeContainer(component: any, selector?: string | object | Function): any;
export declare function makeOnlyContainer(component: any, store: any): JSX.Element;
export { Provider as RootContainer };
export { default as Input } from './HOC/Input';
export { default as Checkbox } from './HOC/Checkbox';
export declare class Radiobox extends React.PureComponent<{
    options: Array<XString | string | {
        value: XString | string;
        disabled?: boolean;
    }>;
    selected: string | XString;
    className?: string;
    radioClassName?: string;
    tagClassName?: string;
    disabledTagClassName?: string;
    id?: string;
    vertical?: boolean;
    onChange?: (value?: string) => void;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
export declare class Select extends React.PureComponent<any, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
