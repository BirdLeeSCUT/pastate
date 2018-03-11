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
export declare type MiddlewareContext = {
    name: string;
    agrs?: IArguments;
    return: any;
    store: XStore;
};
export declare type ActionMiddleware = (context: MiddlewareContext, next: Function) => any;
export declare type Middleware = Array<{
    type: "action" | "mutation";
    middleWare: ActionMiddleware;
}>;
export declare class XStore<State = {}, Actions = {}, Mutations = {}> {
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
     * 执行 operation 操作前暂存的 imState 值
     */
    preState: State;
    /**
     * dispatch 函数，待注入
     * 当 state 发生改变后，会出发这个函数通知视图进行更新
     * 目前该函数用于与 redux 配合使用: pastate-redux-react
     * 下一步：脱离 redux, 直接实现连接 react: pastate-react
     */
    dispatch: (action: any) => State;
    /**
     * 表示是否正在累积操作
     */
    isQueuingOperations: boolean;
    /**
     * 待执行的 operation 列表.
     * 把 operation 累积起来再一起执行，可以实现一些基于多 operation 的中间件，具有较多的可操作性
     */
    pendingOperationQueue: Array<XOperation>;
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
     * 通过 path 获取 imState
     */
    getByPath(path: string | Array<string>): any;
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
     * 当前值为 null 或 undefined 时需要用此方法
     */
    setByPath(path: string | Array<string>, newValue: any, description?: string): XStore<State>;
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
    /**
     * 改为 seeter, 分出 _actions middlesware 和 mutations middleware 和 生命周期函数 middleware ?
     */
    private _actions;
    actions: Actions;
    private _actionMiddlewares;
    actionMiddlewares: Array<ActionMiddleware>;
    private linkActionMiddleWare(actions?, path?);
}
