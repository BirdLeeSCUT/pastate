/**
 * XStore 实现
 */
import { Dispatch, Provider } from 'react-redux';
import { Store } from 'redux';

interface XOperation {
    operation: 'set' | 'merge' | 'update' | 'mark',
    path?: string,
    payload?: any,
    description?: string
}

export class XStore<State extends XType> {

    public __PASTATE_STORE__?: boolean

    /**
     * 制定当前 store 的名称，可选
     */
    public name: string

    /** 
     * immutable state 对象
     */
    public imState: State

    /**
     * 响应式 state
     */
    public state: State

    /**
     * 执行 operation 操作前暂存的 state 值
     */
    public preState: State

    /**
     * dispatch 函数，待注入
     */
    public dispatch: Dispatch<any>

    /**
     * 表示是否正在累积操作
     */
    public isQueuingOperations: boolean

    /**
     * 待执行的 operation 列表.
     * 把 operation 累积起来再一起执行，可以实现一些基于多 operation 的中间件，具有较多的可操作性 
     */
    public pendingOperationQueue: Array<XOperation>


    public actions: {
        [key: string]: Function
    }

    public mutations: {
        [key: string]: Function
    }

    // 配置项和默认值
    // TODO 尝试支持 react 16.2 的 Fragment 包围语法，而不是 span
    public config: {
        useSpanNumber: boolean
    }

    // 兼容原始 reducer 的功能暂不实现
    // private reducer: Function
    // setRawReducer(reducer: (state: State, action: Object) => State): void
    /**
     * 构造state
     * @param initState 
     * @param createElement 可选，如果注入，数字可以直接渲染
     */
    constructor(initState: State, config?: {
        useSpanNumber?: boolean
    })

    // MARK: 响应式 rstate 的处理相关函数
    private makeRState(path: string[], newValue?: any): any

    // 通过 imState 获取响应式 state
    public getResponsiveState(imState: XType): any

    // MARK: operation 输入相关方法 -----------------------------------------------------------

    /**
     * ### 对 state 进行 set 操作
     * @param stateToOperate 
     * @param newValue : T | null , FIXME: 引入 Xtype 的 null 对象后， 可把 null 取消掉
     * @param description 
     * @return this 以支持链式调用
     */
    public set<T>(stateToOperate: T, newValue: T, description?: string): XStore<State>
    /**
     * set 设置新属性的版本
     * // TODO 待改为 setByPath
     * 当现值为 null 或 undefined 时需要用此方法
     * @argument literalPath 路径，如 ''(root) , '.prop1', '.prop1.prop2'
     */
    public setNew(literalPath: string, newValue: any, description?: string): XStore<State>

    /**
     * 同步版本的 set
     * 用户表单输入的更新
     */
    public setSync(state: any, newValue: any): XStore<State>

    /**
     * ### 对 state 进行 merge 操作
     * 进行的是浅层 merge 
     * // TODO: 待研究 deep merge 的必要性
     * @param stateToOperate 
     * @param newValue 
     * @param description 
     */
    public merge<T>(stateToOperate: T, newValue: Partial<T>, description?: string): XStore<State>

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
    public update<T>(stateToOperate: T, updater: (value: T) => T, description?: string): XStore<State>

    /**
     * 底层operation提交函数
     * 检查提交参数，如果合法，把操作提交到待执行操作列表
     */
    private submitOperation(rawParams: {
        operate: 'set' | 'merge' | 'update',
        stateToOperate: any,
        payload: any,
        description?: any
    }): void

    /**
     * 设置 operation 描述型分割线，可以再执行 operation 时输出
     */
    public setOperationMarker(description: string): void

    /**
     * 尝试把 operation 加入到 pendding 队列
     */
    private tryPushOperation(operation: XOperation): void



    // MARK: operation 处理相关方法 ------------------------------------------------------

    /**
     * operations 队列处理启动函数
     * // TO TEST
     */
    public beginReduceOpertions(): void

    public forceUpdate(): void

    /** 
     * operation 项处理器，负责 imState = imState + operation 的逻辑
     * @throws 但执行失败时直接抛出异常
     * @returns object
     */
    private applyOperation(operation: XOperation): {
        isMarker: boolean,
        oldValue: any,
        tookEffect: boolean
    }

    /**
     * 通过路径获取 state 中的值
     * // Basic Tested
     * @param path 
     */
    public static getValueByPath(rootObj: any, pathArr: Array<string>)

    /**
     * 溯源性地更新节点的引用对象并返回
     * @param pathArr 
     * @return 更新后的节点的值
     */
    public getNewReference(pathArr: Array<string>): XType

    /** 
     * 实现普通类型到 XType 类型的转化
     */
    public toXType(rawData: any, path: string): XType | undefined | null
    

    
        // MARK: 生命周期函数 ----------------------------------------------------------------

    /**
     * 生命周期函数：将要增加 operation 时会被调用
     * @param operate 
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateWillAddOperation(operation: XOperation): boolean

    /**
     * 生命周期函数：将要执行 operations 时会被调用
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateWillReduceOperations(): boolean

    /**
     * 生命周期函数：将要执行一个 operation 时会被调用
     * @param operationIndex operations 中的索引号
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateWillApplyOperation(operationIndex: number): boolean

    /**
     * 生命周期函数：执行完一个 operation 后会被调用
     * @param info object
     *  - index 表示 operations 中的索引号
     *  - tookEffect 表示这个 operation 是否对 state 产生修改作用
     *  - oldValue 执行这个操作前的 state
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateDidAppliedOperation(info: {
        index: number,
        tookEffect: boolean,
        oldValue: Map<any, any>
    }): boolean 

    /**
     * 生命周期函数：执行完 operations 时执行
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateDidReducedOperations(stats: {
        isDone: boolean, // 表明 operation reduce 过程是否终止
        all: number, // 执行的 operation 总数
        realOperation: number, // 非 marker 的 operation 总数
        hadRan: number, // 成功运行的 operation 总数
        tookEffect: number, // 使 state 改变的 operation 总数
    }): boolean 

    // -------------------------- redux 对接函数 ------------------------------
    public getReduxReducer()

    // -------------------------------- form 对接函数 -----------------------------
    public syncInput(state: any): (event: any) => void

}

// TODO: 处理不可枚举的情况
export interface XType {
    __xpath__?: string
}

export class XBoolean extends Boolean implements XType {
    __xpath__: string
}

export class XNumber extends Number implements XType {
    __xpath__: string
}

export class XString extends String implements XType {
    __xpath__: string
}

export class XArray extends Array<any> implements XType {
    __xpath__: string
}

export class XObject extends Object implements XType {
    __xpath__: string
}

export function makeReduxStore(storeTree: any): Store<any>

export function makeContainer(component: any, selector?: string | object | Function): React.Component

export function makeOnlyContainer(component: any, store: any): React.ReactElement<any>

export { Provider as RootContainer }