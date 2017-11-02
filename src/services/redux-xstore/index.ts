/**
 * XStore 实现
 */

import { fromJS, Map } from 'immutable'

interface XOperation {
    operate: 'set' | 'merge' | 'update' | 'marker',
    path?: string,
    payload?: any,
    description?: string
}

export class XStore<State extends XType> {

    // state 仅支持对象类型
    public state: State;

    // FIXME: 测试时为 public，上线时应该改为 private
    // NOTE: 第一版先实现基于imjs的操作
    // TODO: 增强对其他类型 state 的支持，如 array, simple type
    public imState: Map<any, any>;

    /**
     * 表示是否正在累积操作
     */
    public isCollectingOperation: boolean;

    /**
     * 待执行的 operation 列表.
     * 把 operation 累积起来再一起执行，可以实现一些基于多 operation 的中间件，具有较多的可操作性 
     */
    public pendingOperationList: Array<XOperation>

    /******
     * NEXT： 先把流程图画出来，再实现流程图
     * ****
     */

    public actions: {
        [key: string]: Function
    }

    public mutations: {
        [key: string]: Function
    }

    private keyPathMap: {
        [key: string]: Array<string>
    }

    // 兼容原始 reducer 的功能暂不实现
    // private reducer: Function
    // setRawReducer(reducer: (state: State, action: Object) => State): void

    constructor(initState: State) {
        this.state = XStore.toXType(initState, '') as State;
    }

    // --- state 面门操作方法 ---

    /**
     * ### 对 state 进行 set 操作
     * @param stateToOperate 
     * @param newValue 
     * @param description 
     */
    public set<T extends XType>(stateToOperate: T, newValue: T, description?: string): void {
        this.submitOperation({
            operate: 'set',
            stateToOperate: stateToOperate,
            payload: newValue,
            description: description
        })
    }

    /**
     * ### 对 state 进行 merge 操作
     * 进行的是浅层 merge 
     * // TODO: 待研究 deep merge 的必要性
     * @param stateToOperate 
     * @param newValue 
     * @param description 
     */
    public merge<T extends XType>(stateToOperate: T, newValue: Partial<T>, description?: string): void {
        this.submitOperation({
            operate: 'merge',
            stateToOperate: stateToOperate,
            payload: newValue,
            description: description
        })
    }

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
    public update(stateToOperate: any, updater: Function, description?: string): void {

    }

    /**
     * 底层operation提交函数
     * 检查提交参数，如果合法，把操作提交到待执行操作列表
     */
    private submitOperation(rawParams: {
        operate: 'set' | 'merge' | 'update',
        stateToOperate: any,
        payload: any,
        description?: any
    }){

        // stateToOperate 合法性处理
        if (rawParams.stateToOperate === undefined || rawParams.stateToOperate === null) {
            console.warn('Opertion can only perform operation using `path inferrence` when the state is not undefined or null state.')
            console.warn('`stateToOperate` is given ', rawParams.stateToOperate, ', please checkout are there some errors in `stateToOperate`. If not, try below:')
            console.warn('There are some ways to go, choose one as you like:')
            console.warn('- Use literal path instead: for example, use this.set(\'this.state.propThatIsNull\', ...), not this.set(this.state.propThatIsNull, ...)')
            console.warn('- If you want to use operation with path inferrence from, you should use {}, \'\', NaN to be the initial value, and do not set any state value to be undefined or null' )

            if ( rawParams.operate == 'set'){
                console.warn('- You also can use `merge` operation to set the new value into the state that is having undefined or null value.')
            }
            if ( rawParams.operate == 'update'){
                console.warn('- If you want to update a state without using present it`s value, it is no need to use `update` operation, please use `set` or `merge` instead.')
            }

            throw Error(`[Error store.${rawParams.operate}] \`stateToOperate\` is undefined or null.`)
        }

        // 路径提取
        let path = '';
        if (rawParams.stateToOperate.__xpath__ == undefined) {
            // TODO 

            throw Error(`[Error store.${rawParams.operate}] \`stateToOperate\` can only be this.state... or literal path begin with \`this.state\`.`)
        }

        // payload 合法性处理
        if (rawParams.payload == undefined){
            console.warn(`You operation payload to ${path} is \`undefined\`, please check if you really want to do it.`)
        }

        // 执行正式 operation 队列插入操作
        this.setupAsyncOperationCallback();
        this.pendingOperationList.push({
            operate: 'set',
            path: path ,
            payload: rawParams.payload,
            description: rawParams.description
        })
    }

    /** 
     * 设置异步 operation 启动器
     */
    public setupAsyncOperationCallback(){
        if ( ! this.isCollectingOperation ){
            this.isCollectingOperation = true;
            setTimeout( () => {
                this.isCollectingOperation = false;
                this.beginReduceOpertions();
            }, 0);
        }
    }

    /**
     * 设置 operation 描述分割线，可以再执行 operation 时输出
     */
    public setOperationMarker(description: string): void {

    }

    /**
     * 生命周期函数：将要增加 operation 时会被调用
     * @param operate 
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateWillAddOperation(operation: XOperation): boolean {
        // TODO
        // 可以实现 logger，chrome 调试器等功能
        // 建议实现检查 payload 类型合法性的功能
        return true;
    }

    /**
     * 生命周期函数：将要执行 operations 时会被调用
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateWillReduceOperations(): boolean {
        // TODO 可以实现 operation 序列检查器功能，提醒一些不建议的操作等
        // 在开发本类库时，还可以检查是否产生空序列执行等问题
        return true;
    }

    /**
     * 生命周期函数：将要执行一个 operation 时会被调用
     * @param operationIndex operations 中的索引号
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateWillApplyOperation(operationIndex: number): boolean {
        // 可以实现某些中间件
        return true
    }

    /**
     * 生命周期函数：执行完一个 operation 后会被调用
     * @param operationIndex operations 中的索引号
     * @param oldImValue 执行这个操作前的imState
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateDidAppliedOperation(operationIndex: number, oldImValue: Map<any, any>): boolean {
        // 可以实现 operation细节logger 等功能
        return true
    }

    /**
     * 生命周期函数：执行完 operations 时执行
     * @returns boolean 表示是否继续执行后续操作
     */
    public stateDidReducedOperations(): boolean {
        // TODO 可以输出操作到调试器等，此时 this.operations 数组还没重置；可以用于本类库测试，也可以用于消费者的调试
        return true
    }

    /**
     * operations 集合处理启动函数
     */
    private beginReduceOpertions(){

    }

    /** 
     * operation 项处理器，负责 imState = imState + operation 的逻辑
     */
    private reduceOperation(operation: XOperation) {

    }

    /** 
     * 实现普通类型到 XType 类型的转化
     */
    public static toXType(rawData: any, path: string): XType | undefined | null {

        // NOTE: 如果根据自实现 immuateble 转化逻辑，此处有性能优化空间

        if (rawData === undefined) {
            return undefined;
        }

        if (rawData === null) {
            return null;
        }

        let xNewData: XType;
        let typeName: string = (Object.prototype.toString.call(rawData) as string).slice(8, -1);

        // 处理 raw 类型
        if (rawData.__xpath__ === undefined) {
            switch (typeName) {
                case 'Boolean':
                    xNewData = new Boolean(rawData) as XBoolean;
                    break;
                case 'Number':
                    xNewData = new Number(rawData) as XNumber;
                    break;
                case 'String':
                    xNewData = new String(rawData) as XString;
                    break;
                case 'Array':
                    xNewData = new Array(rawData) as XArray;
                    // recursive call toXType(...) to transform the inner data
                    xNewData = (rawData as Array<any>).map(function (value: any, index: number) {
                        return XStore.toXType(value, path + '.' + index)
                    }) as XType;
                    break;
                case 'Object':
                    xNewData = new XObject(rawData);
                    // recursive call toXType(...) to transform the inner data
                    for (let prop in xNewData) {
                        if (xNewData.hasOwnProperty(prop) && prop !== '__xpath__') {
                            rawData[prop] = XStore.toXType(rawData[prop], path + '.' + prop)
                        }
                    }
                    break;
                default:
                    console.error('[XStore] XType transform error:', typeName);
                    xNewData = new XObject(undefined);
            }
        }
        // 处理 xtype 类型
        else {
            xNewData = rawData;
            // NOTE: 根据 im 特性，对于 array 和 object 类型，如果内部数据改变，则溯源节点的引用都会更新，此时该节点会变成 plain 类型，会走上面的转化过程
        }
        xNewData.__xpath__ = path;

        return xNewData;
    }

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
