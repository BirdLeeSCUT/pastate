/**
 * XStore 实现
 */

import { fromJS, Map } from 'immutable'

interface XOperation {
    operation: 'set' | 'merge' | 'update' | 'mark',
    path?: string,
    payload?: any,
    description?: string
}

export class XStore<State extends XType> {

    /* 
     * state 仅支持对象类型
     */
    public state: State;

    /**
     * 执行 operation 操作前暂存的 state 值
     */
    public preState: State;

    /**
     * 表示是否正在累积操作
     */
    public isQueuingOperations: boolean;

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



    // 兼容原始 reducer 的功能暂不实现
    // private reducer: Function
    // setRawReducer(reducer: (state: State, action: Object) => State): void

    constructor(initState: State) {
        this.state = XStore.toXType(initState, '') as State;
        this.isQueuingOperations = false;
        this.pendingOperationQueue = [];
    }



    // MARK: operation 输入相关方法 -----------------------------------------------------------

    /**
     * ### 对 state 进行 set 操作
     * @param stateToOperate 
     * @param newValue : T | null , FIXME: 引入 Xtype 的 null 对象后， 可把 null 取消掉
     * @param description 
     * @return this 以支持链式调用
     */
    public set<T>(stateToOperate: T, newValue: T, description?: string): XStore<State> {
        this.submitOperation({
            operate: 'set',
            stateToOperate: stateToOperate,
            payload: newValue,
            description: description
        })
        return this
    }
    /**
     * set 设置新属性的版本
     * // TODO 待改为 setByPath
     * 当现值为 null 或 undefined 时需要用此方法
     * @argument literalPath 路径，如 ''(root) , '.prop1', '.prop1.prop2'
     */
    public setNew(literalPath: string, newValue: any, description?: string): XStore<State> {
        if (typeof literalPath != 'string') {
            throw Error('[store.setNew] literalPath can only be string')
        }
        this.submitOperation({
            operate: 'set',
            stateToOperate: {
                __xpath__: literalPath
            },
            payload: newValue,
            description: description
        })
        return this
    }

    /**
     * ### 对 state 进行 merge 操作
     * 进行的是浅层 merge 
     * // TODO: 待研究 deep merge 的必要性
     * @param stateToOperate 
     * @param newValue 
     * @param description 
     */
    public merge<T>(stateToOperate: T, newValue: Partial<T>, description?: string): XStore<State> {
        this.submitOperation({
            operate: 'merge',
            stateToOperate: stateToOperate,
            payload: newValue,
            description: description
        })
        return this
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
    public update<T>(stateToOperate: T, updater: (value: T) => T, description?: string): XStore<State> {
        this.submitOperation({
            operate: 'update',
            stateToOperate: stateToOperate,
            payload: updater,
            description: description
        })
        return this
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
    }) {

        // stateToOperate 合法性处理
        if (rawParams.stateToOperate === undefined || rawParams.stateToOperate === null) {
            console.warn('Opertion can only perform operation using `path inferrence` when the state is not undefined or null state.')
            console.warn('`stateToOperate` is given ', rawParams.stateToOperate, ', please checkout are there some errors in `stateToOperate`. If not, try below:')
            console.warn('There are some ways to go, choose one as you like:')
            console.warn('- Use `setNew` instead: for example, this.setNew(\'this.state.propThatIsNull\', ...)')
            console.warn('- If you want to use operation with path inferrence from, you should use {}, \'\', NaN to be the initial value, and do not set any state value to be undefined or null')

            if (rawParams.operate == 'set') {
                console.warn('- You also can use `merge` operation to set the new value into the state that is having undefined or null value.')
            }
            if (rawParams.operate == 'update') {
                console.warn('- If you want to update a state without using present it`s value, it is no need to use `update` operation, please use `set` or `merge` instead.')
            }

            throw Error(`[Error store.${rawParams.operate}] \`stateToOperate\` is undefined or null.`)
        }

        // 路径提取
        let path = '';
        if (typeof (rawParams.stateToOperate as XType).__xpath__ == 'string') {
            path = (rawParams.stateToOperate as XType).__xpath__ as string
        } else {
            throw Error(`[Error store.${rawParams.operate}] \`stateToOperate\` has no string __xpath__`)
        }

        // payload 合法性处理
        let payloadType: string = (Object.prototype.toString.call(rawParams.payload) as string).slice(8, -1);
        if (payloadType == 'Undefined' || payloadType == 'Null') {
            console.warn(`You operation payload to ${path} is \`undefined\` or \`null\`, please check if you really want to do it.`)
        }

        // 执行 operation 队列插入操作
        this.tryPushOperation({
            operation: rawParams.operate,
            path: path,
            payload: rawParams.payload,
            description: rawParams.description
        })
    }

    /**
     * 设置 operation 描述型分割线，可以再执行 operation 时输出
     */
    public setOperationMarker(description: string): void {
        this.tryPushOperation({
            operation: 'mark',
            description: description
        })
    }

    /**
     * 尝试把 operation 加入到 pendding 队列
     */
    private tryPushOperation(operation: XOperation) {
        if (this.stateWillAddOperation(operation)) {
            // 设置异步 operation 启动器
            if (!this.isQueuingOperations) {
                this.isQueuingOperations = true;
                setTimeout(() => {
                    this.isQueuingOperations = false;
                    this.beginReduceOpertions();
                }, 0);
            }
            this.pendingOperationQueue.push(operation)
        } else {
            console.info('[Error store.tryPushOperation] Operation pushing is canceled.')
        }
    }



    // MARK: operation 处理相关方法 ------------------------------------------------------

    /**
     * operations 队列处理启动函数
     * // TO TEST
     */
    public beginReduceOpertions() {

        // 本函数主要负责流程控制和生命周期函数的调用
        if (!this.stateWillReduceOperations()) {
            console.info('Operations reducing has been canceled at beginning!')
            return;
        }

        let loadingOperationQueue = this.pendingOperationQueue;
        this.pendingOperationQueue = [];
        this.preState = this.state;


        let hadRan = 0;
        let tookEffect = 0;
        let isDone = false;

        // 按顺序 reduce operation
        try {

            isDone = loadingOperationQueue.every((operation: XOperation, index: number) => {

                if (!this.stateWillApplyOperation(index)) {
                    console.info(`Operations reducing has been canceled at ${index}!`, operation)
                    return false
                }

                let result = this.applyOperation(operation)

                if (!result.isMarker) hadRan += 1;
                if (result.tookEffect) tookEffect += 1;

                if (!this.stateDidAppliedOperation({
                    index,
                    tookEffect: result.tookEffect,
                    oldValue: result.oldValue
                })) {
                    console.info(`Operations reducing has been stop after ${index}!`, operation)
                    return false
                }

                return true
            })
        } catch(e) {
            console.error('[XStore] Operation reduction is terminated: ' + (e as Error).message );
        }

        this.stateDidReducedOperations({
            isDone, // 表明是否全部成功执行
            all: loadingOperationQueue.length, // 待执行的 operation 总数
            realOperation: loadingOperationQueue.filter(v => v.operation != 'mark').length, // 非 marker 的 operation 总数
            hadRan, // 已成功运行的 operation 总数
            tookEffect, // 使 state 改变的 operation 总数
        })


    }

    /** 
     * operation 项处理器，负责 imState = imState + operation 的逻辑
     * @throws 但执行失败时直接抛出异常
     * @returns object
     */
    private applyOperation(operation: XOperation): {
        isMarker: boolean,
        oldValue: any,
        tookEffect: boolean
    } {

        if (operation.operation == 'mark') {
            // 如果要在其他地方实现 log 逻辑，那么需要在实现处把这个 operation “消化掉”（reduce）
            console.log(`[Operation Marker]  ----------- ${operation.description} ----------- `)
            return {
                isMarker: true,
                oldValue: this.state,
                tookEffect: false
            }
        }

        // 实现笔记
        // 阶段一：（1）路径更新 -> (2)值的赋值 【这样一来，tookEffect 的值都是 true】
        // 阶段二：实现 tookEffect 的逻辑

        // 目前为阶段一的实现
        // 采用 方向溯回更新期的逻辑进行更新
        // A. 如果要设置的值是 基础类型，则需更新其父亲的引用
        // B. 如果要更新的值是 数组或对象，则虚更新本身及其父亲的引用

        let pathArr: Array<any> = operation.path!.split('.');
        pathArr.shift();

        let endPath;
        let curValue;
        let payload = operation.payload;
        let preValue = XStore.getValueByPath(this.preState, pathArr);
        let valueType = (Object.prototype.toString.call(preValue) as string).slice(8, -1);

        // set 作用于任何值
        if (operation.operation == 'set') {

            // “相同” 值情况的处理
            // "相同" 的基本值不进行更新处理；"相同"的引用值进行更新引用处理
            if (payload == preValue) {
                if (valueType == 'Array') {
                    payload = [...payload]
                } else if (valueType == 'Object') {
                    payload = { ...payload }
                } else {
                    return {
                        isMarker: false,
                        oldValue: this.preState,
                        tookEffect: false
                    }
                }
            }

            // 更新根值的情况
            if (pathArr.length == 0) {
                this.state = XStore.toXType(payload, operation.path!) as State;
                console.info('[set] You are setting the entire state, please check if you really want to do it.')
            } else {
                endPath = pathArr.pop();
                curValue = this.getNewReference(pathArr);
                curValue[Array.isArray(curValue) ? [endPath - 0] : endPath] = XStore.toXType(payload, operation.path!)
            }

            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true
            }
        }

        // merge 仅是作用于对象
        if (operation.operation == 'merge') {

            // 仅支持对对象进行处理
            if (valueType != 'Object') {
                throw Error('[merge] You can only apply `merge` operation on object')
            }

            if ((Object.prototype.toString.call(payload) as string).slice(8, -1) != 'Object') {
                throw Error('[merge] You can only apply `merge` operation with an object payload')
            }

            curValue = this.getNewReference(pathArr);

            for (let key in payload) {
                // payload 一般是字面值给出的，无需检查 hasOwnProperty
                if (key != '__xpath__') {
                    // NOTE: 此处暂不实现 takeEffect 逻辑
                    curValue[key] = XStore.toXType(payload[key], operation.path + '.' + key)
                }
            }

            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true // 这里暂时均为生效
            }
        }

        // update 作用于任何值
        if (operation.operation == 'update') {
            // TODO: next
        }


        return {
            isMarker: false,
            oldValue: this.preState,
            tookEffect: false
        }
    }

    /**
     * 通过路径获取 state 中的值
     * // Basic Tested
     * @param path 
     */
    public static getValueByPath(rootObj: any, pathArr: Array<string>) {
        return pathArr.reduce((preValue, curPath: any) => preValue[Array.isArray(preValue) ? (curPath - 0) : curPath], rootObj)
    }

    /**
     * 溯源性地更新节点的引用对象并返回
     * @param pathArr 
     * @return 更新后的节点的值
     */
    public getNewReference(pathArr: Array<string>): XType {
        let curValue: XType = XStore.getValueByPath(this.state, pathArr);
        let preValue: XType = XStore.getValueByPath(this.preState, pathArr);
        // 该函数只（需）支持对象或数组的情况
        // 测试时请勿传入指向基本值的 path , 实际情况中无需实现
        if (curValue == preValue) {

            curValue = Array.isArray(preValue) ? [...preValue] as XType : { ...preValue } as XType;
            curValue.__xpath__ = preValue.__xpath__;
            // FIXME: 处理不可枚举的问题

            // 溯源更新 后 挂载新值（此处不可逆序，否则会导致 preState 被改动）
            if (pathArr.length == 0) {
                this.state = curValue as State;
            } else {
                let endPath: any = pathArr.pop();
                let fatherValue = this.getNewReference([...pathArr]); // 此处特别注意要 “按值传参”
                fatherValue[Array.isArray(fatherValue) ? (endPath - 0) : endPath] = curValue;
            }
        }
        return curValue;
    }

    /** 
     * 实现普通类型到 XType 类型的转化
     * FIXME: 增加支持 XType raw 值的情况
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

    // MARK: 生命周期函数 ----------------------------------------------------------------

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
    }): boolean {
        // 可以实现 operation细节logger 等功能
        return true
    }

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
    }): boolean {
        // TODO 可以输出操作到调试器等，此时 this.operations 数组还没重置；可以用于本类库测试，也可以用于消费者的调试
        // 可以对 preState 进行 log, 压栈（以支持撤销）等操作
        return true
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
