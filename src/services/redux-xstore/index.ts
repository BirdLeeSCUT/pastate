/**
 * XStore 实现
 */
import { fromJS, Map } from 'immutable'
import { Action, Reducer } from 'redux';
import { Dispatch, connect } from 'react-redux';
import { ChangeEvent, Component, createElement } from 'react';
import { createStore, combineReducers, Store } from 'redux'

interface XOperation {
    operation: 'set' | 'merge' | 'update' | 'mark',
    path?: string,
    payload?: any,
    description?: string
}

export class XStore<State extends XType> {

    public __PASTATE_STORE__ = true;

    /**
     * 制定当前 store 的名称，可选
     */
    public name: string = 'anonymous component';

    /** 
     * state 对象
     */
    public state: State;

    /**
     * 响应式 state
     */
    public rstate: State;

    /**
     * 执行 operation 操作前暂存的 state 值
     */
    public preState: State;

    /**
     * dispatch 函数，待注入
     */
    public dispatch: Dispatch<any>;

    /**
     * 表示是否正在累积操作
     */
    public isQueuingOperations = false;

    /**
     * 待执行的 operation 列表.
     * 把 operation 累积起来再一起执行，可以实现一些基于多 operation 的中间件，具有较多的可操作性 
     */
    public pendingOperationQueue: Array<XOperation> = []


    public actions: {
        [key: string]: Function
    }

    public mutations: {
        [key: string]: Function
    }

    // 配置项和默认值
    // TODO 尝试支持 react 16.2 的 Fragment 包围语法，而不是 span
    public config = {
        useSpanNumber: true
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
    }) {
        config && ((Object as any).assign(this.config, config));
        this.state = this.toXType(initState, '') as State;
        // TODO: 处理新建对象的情况（数组函数, 把null设为对象值）
        this.rstate = this.makeRState([]);
        this.preState = this.state;
    }


    // MARK: 响应式 rstate 的处理相关函数
    private makeRState(path: string[], newValue?: any): any {
        let node: any;
        if (newValue) {
            let newValueTypeName: string = (Object.prototype.toString.call(node) as string).slice(8, -1);
            switch (newValueTypeName) {
                case 'Object': node = { ...newValue }; break;
                case 'Array': node = [...newValue]; break;
                default: node = newValue;
            }
        } else {
            node = XStore.getValueByPath(this.state, path);
        }
        let typeName: string = (Object.prototype.toString.call(node) as string).slice(8, -1);

        let rnode: any;
        if (typeName == 'Object') {
            rnode = {}
        } else if (typeName == 'Array') {
            // 待往外封装（需要把 set 操作改为非 this.xx 模式才可以封装）
            rnode = [];
            let context = this;

            // 这种实现模式看起来比较耗资源， 考虑使用对象原因的模式  
            // 目前只支持 push 单一元素          
            Object.defineProperty(rnode, 'push', {
                enumerable: false,
                get: function () {
                    // 目前只支持插入一个元素，新版本将支持插入多个元素
                    return function (element: any) {
                        context.update(XStore.getValueByPath(context.state, path), arr => [...arr, element]);
                        let rValue = context.makeRState([...path, rnode.length], element)
                        Object.defineProperty(rnode, rnode.length, {
                            enumerable: true,
                            configurable: true,
                            get: () => {
                                return rValue;
                            },
                            set: (_newValue: any) => {
                                context.set(XStore.getValueByPath(context.state, path)[rnode.length], _newValue)
                            }
                        })
                    }
                }
            })

            Object.defineProperty(rnode, 'pop', {
                enumerable: false,
                get: function () {
                    return function () {
                        if(rnode.length <= 0){
                            return null
                        }
                        let lastOneIndex = rnode.length - 1;
                        // FIXME: 把 arr.slice(0, lastOneIndex) 改为 arr.slice(0, -1) 会发生无法多次pop的问题 ？
                        context.update(XStore.getValueByPath(context.state, path), arr => arr.slice(0, lastOneIndex));
                        delete rnode[lastOneIndex]
                        rnode.length -= 1
                        return XStore.getValueByPath(context.state, path)[lastOneIndex]
                    }
                }
            })

            // 目前只支持 unshift 单一元素 
            Object.defineProperty(rnode, 'unshift', {
                enumerable: false,
                get: function () {
                    // 目前只支持插入一个元素，新版本将支持插入多个元素
                    return function (element: any) {
                        context.update(XStore.getValueByPath(context.state, path), arr => [element, ...arr]);
                        let rValue = context.makeRState([...path, rnode.length], element)
                        Object.defineProperty(rnode, rnode.length, {
                            enumerable: true,
                            configurable: true,
                            get: () => {
                                return rValue;
                            },
                            set: (_newValue: any) => {
                                context.set(XStore.getValueByPath(context.state, path)[rnode.length], _newValue)
                            }
                        })
                    }
                }
            })

            // DELAY: 这个方法兼容push的新值结构不一致的情况
            // 基于 pathstate 的模式在数组对象的需要变化时，会导致所有需要重新遍历所有子树的 pathstate 值, 此处有优化空间
            // Object.defineProperty(rnode, '_unshift', {
            //     enumerable: false,
            //     get: function () {
            //         return function (element: any) {
            //             // 基于 pathstate 的模式在数组对象的需要变化时，会导致所有需要重新遍历所有子树的 pathstate 值, 此处有优化空间

            //             element = {...element}
            //             context.update(XStore.getValueByPath(context.state, path), arr => [element, ...arr]);
            //             let newRNode = context.makeRState(path, [element, ...XStore.getValueByPath(context.state, path)]);
            //             // TODO: 更新挂载点
            //         }
            //     }
            // })

            Object.defineProperty(rnode, 'shift', {
                enumerable: false,
                get: function () {
                    return function () {
                        if(rnode.length <= 0){
                            return null
                        }
                        let lastOneIndex = rnode.length - 1;
                        context.update(XStore.getValueByPath(context.state, path), arr => arr.slice(1));
                        delete rnode[lastOneIndex]
                        rnode.length -= 1
                        let targetArray = XStore.getValueByPath(context.state, path);
                        return targetArray[targetArray.length - rnode.length - 1]
                    }
                }
            })

            Object.defineProperty(rnode, 'splice', {
                enumerable: false,
                get: function () {
                    // 目前只支持插入一个元素，新版本将支持插入多个元素
                    return function (start: number, deleteCount: number, newElement: any) {
                        context.update(XStore.getValueByPath(context.state, path), arr => {
                            arr.splice(start, deleteCount, newElement)
                            return arr
                        });
                        let lastOneIndex = rnode.length - 1;
                        for (let i = 0; i < deleteCount - (newElement !== undefined ? 1 : 0); i++) {
                            delete rnode[lastOneIndex - i]
                        }
                        rnode.length -= (deleteCount - (newElement !== undefined ? 1 : 0))
                        let targetArray = XStore.getValueByPath(context.state, path);
                        return targetArray.slice(start, start + deleteCount)
                    }
                }
            })

            Object.defineProperty(rnode, 'sort', {
                enumerable: false,
                get: function () {
                    return function (compareFunction: any) {
                        context.update(XStore.getValueByPath(context.state, path), arr => arr.sort(compareFunction));
                        return XStore.getValueByPath(context.state, path)
                    }
                }
            })

            Object.defineProperty(rnode, 'reverse', {
                enumerable: false,
                get: function () {
                    return function () {
                        context.update(XStore.getValueByPath(context.state, path), arr => arr.reverse());
                        return XStore.getValueByPath(context.state, path)
                    }
                }
            })


        } else {
            throw new Error('updateRState meet not object value, this is an error of pastate, typeName: ' + typeName)
        }

        for (let prop in node) {
            if (node.hasOwnProperty(prop) && prop != '__xpath__') {

                let valueTypeName: string = (Object.prototype.toString.call(node[prop]) as string).slice(8, -1);

                // 对象嵌套响应式建立
                if (valueTypeName == 'Object' || valueTypeName == 'Array') {
                    // 对象或数组，建立新的响应式节点
                    let rValue = this.makeRState([...path, prop], node[prop])
                    Object.defineProperty(rnode, prop, {
                        enumerable: true,
                        configurable: true,
                        get: () => {
                            let valueToGet = XStore.getValueByPath(this.state, path)[prop];
                            if(valueToGet === null || valueToGet === undefined){
                                return valueToGet;
                            }else{
                                return rValue;
                            }
                            
                        },
                        set: (_newValue: any) => {
                            
                            // 把对象节点设置为 null 的情况
                            if(_newValue === null || _newValue === undefined){
                                console.warn(`[pastate] You are setting an ${valueTypeName} node to be '${_newValue}', which is deprecated.`)
                            }

                            let valueToSet = XStore.getValueByPath(this.state, path)[prop];

                            if(valueToSet === null || valueToSet === undefined){
                                this.merge({__xpath__: path.map(p => '.' + p).join('')}, {
                                    [prop]: _newValue
                                } as any)
                            }else{
                                this.set(valueToSet, _newValue)
                            }

                            // 响应式数组长度变化处理
                            if(valueTypeName == 'Array'){
                                
                                // DALAY: 方法一：为了提高效率，只做长度调整，重复利用现有元素
                                // let adjustCount = _newValue.length - valueToSet.length;
                                // if(adjustCount > 0){
                                // }else if(adjustCount < 0){
                                // }

                                // 方法二：重新建立响应式节点
                                rValue = this.makeRState([...path, prop], _newValue)
                            }
                            
                        }
                    })
                } else {
                    // 基本类型
                    Object.defineProperty(rnode, prop, {
                        enumerable: true,
                        configurable: true,
                        get: () => {
                            let getValue = XStore.getValueByPath(this.state, path)[prop];
                            if(getValue === null || getValue === undefined){
                                return getValue
                            }
                            switch (valueTypeName) {
                                // 返回非对象类型的 plain 数据
                                case 'Number': return +getValue;
                                case 'Boolean': return getValue == true;
                                // 文字保留对象类型也可以，此处不一定要转化
                                case 'String': return getValue + '';
                                default: return getValue
                            }
                        },
                        set: (_newValue: any) => {

                            // DALAY: 下版本考虑支持把叶子转化为节点 (开发者水平容错性)
                            let newValueTypeName: string = (Object.prototype.toString.call(_newValue) as string).slice(8, -1);
                            if(newValueTypeName == 'Array' || newValueTypeName == 'Object'){
                                console.error('[pastate] At present, you cannot set an node with the string | number | boolean | null | undefined value to be Array or Object. We will consider support it in the future.')
                                return;
                            }

                            let valueToSet = XStore.getValueByPath(this.state, path)[prop];
                            if(valueToSet === null || valueToSet === undefined){
                                this.merge({__xpath__: path.map(p => '.' + p).join('')}, {
                                    [prop]: _newValue
                                } as any)
                            }else{
                                // TODO:看看原始值是否为null, 如果是，则需要建立响应式
                                this.set(valueToSet, _newValue)
                            }
                        }
                    })
                }

            }
        }
        return rnode;
    }

    private getState(): State {
        return this.state;
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
            throw new Error('[store.setNew] literalPath can only be string')
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
     * 同步版本的 set
     * 用户表单输入的更新
     */
    public setSync(state: any, newValue: any): XStore<State> {
        let pathArr: Array<any> = state.__xpath__.split('.');
        pathArr.shift();
        let endPath: any = pathArr.pop();
        let fatherValue = this.getNewReference(pathArr);
        fatherValue[Array.isArray(fatherValue) ? (endPath - 0) : endPath] = this.toXType(newValue, state.__xpath__)
        this.forceUpdate();
        return this;
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
            console.warn(`[pastate] You are making ${path} to be \`undefined\` or \`null\`, which is deprecated.`)
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
        } catch (e) {
            console.error('[XStore] Operation reduction is terminated: ' + (e as Error).message);
        }

        if (this.dispatch) {
            this.dispatch({
                type: '__XSTORE_UPDATE__: ' + (this.name || '(you can add a name to your xstore via name prop)')
            })
        } else {
            // console.error('[XStore] dispatch method is not injected');
        }

        this.stateDidReducedOperations({
            isDone, // 表明是否全部成功执行
            all: loadingOperationQueue.length, // 待执行的 operation 总数
            realOperation: loadingOperationQueue.filter(v => v.operation != 'mark').length, // 非 marker 的 operation 总数
            hadRan, // 已成功运行的 operation 总数
            tookEffect, // 使 state 改变的 operation 总数
        })


    }

    public forceUpdate() {
        if (this.state == this.preState) {
            this.state = { ...(this.state as XObject) } as State;
        }
        this.preState = this.state;
        if (this.dispatch) {
            this.dispatch({
                type: '__XSTORE_FORCE_UPDATE__: ' + (this.name || '(you can add a name to your xstore via name prop)')
            })
        } else {
            console.error('[XStore] dispatch method is not injected')
        }
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
        let fatherNode;
        let newValue;
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
                this.state = this.toXType(payload, operation.path!) as State;
                console.info('[set] You are setting the entire state, please check if you really want to do it.')
            } else {
                endPath = pathArr.pop();
                fatherNode = this.getNewReference(pathArr);
                fatherNode[Array.isArray(fatherNode) ? [endPath - 0] : endPath] = this.toXType(payload, operation.path!)
            }

            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true
            }
        }
        // merge 仅是作用于对象
        else if (operation.operation == 'merge') {

            // 仅支持对对象进行处理
            if (valueType != 'Object') {
                throw Error('[merge] You can only apply `merge` operation on object')
            }

            if ((Object.prototype.toString.call(payload) as string).slice(8, -1) != 'Object') {
                throw Error('[merge] You can only apply `merge` operation with an object payload')
            }

            fatherNode = this.getNewReference(pathArr);

            for (let key in payload) {
                // payload 一般是字面值给出的，无需检查 hasOwnProperty
                if (key != '__xpath__') {
                    // NOTE: 此处暂不实现 takeEffect 逻辑
                    fatherNode[key] = this.toXType(payload[key], operation.path + '.' + key)
                }
            }

            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true // 这里暂时均为生效
            }
        }

        // update 作用于任何值
        else if (operation.operation == 'update') {

            let oldValue = XStore.getValueByPath(this.state, pathArr);
            if (oldValue === preValue) {
                if (valueType == 'Array') {
                    oldValue = [...oldValue]
                } else if (valueType == 'Object') {
                    oldValue = { ...oldValue }
                }
            }

            newValue = operation.payload(oldValue)
            let newXTypeValue = this.toXType(newValue, operation.path!);

            if (pathArr.length == 0) {
                this.state = newXTypeValue as State;
            } else {
                endPath = pathArr.pop();
                fatherNode = this.getNewReference(pathArr);
                fatherNode[Array.isArray(fatherNode) ? [endPath - 0] : endPath] = newXTypeValue;
            }

            return {
                isMarker: false,
                oldValue: this.preState,
                tookEffect: true // 这里暂时均为生效
            }

        } else {
            throw Error('[XStore] operation invalid!')
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
        pathArr = [...pathArr];
        let curValue: XType = XStore.getValueByPath(this.state, pathArr);
        let preValue: XType = XStore.getValueByPath(this.preState, pathArr);
        // 该函数只（需）支持对象或数组的情况
        // 测试时请勿传入指向基本值的 path , 实际情况中无需实现
        if (curValue == preValue) {

            curValue = Array.isArray(preValue) ? [...preValue] as XType : { ...preValue } as XType;
            Object.defineProperty(curValue, "__xpath__", {
                enumerable: false,
                value: preValue.__xpath__,
                writable: true
            });

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
     */
    public toXType(rawData: any, path: string): XType | undefined | null {

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
                    this.config.useSpanNumber && (Object as any).assign(xNewData, createElement('span', undefined, +rawData));
                    break;
                case 'String':
                    xNewData = new String(rawData) as XString;
                    break;
                case 'Array':
                    xNewData = new Array(rawData) as XArray;
                    // recursive call toXType(...) to transform the inner data
                    xNewData = (rawData as Array<any>).map((value: any, index: number) => {
                        return this.toXType(value, path + '.' + index)
                    }) as XType;
                    break;
                case 'Object':
                    xNewData = new XObject(rawData);
                    // recursive call toXType(...) to transform the inner data
                    for (let prop in xNewData) {
                        if (xNewData.hasOwnProperty(prop) && prop != '__xpath__') {
                            rawData[prop] = this.toXType(rawData[prop], path + '.' + prop);
                        }
                    }
                    break;
                default:
                    console.error('[XStore] XType transform error:', typeName);
                    xNewData = new XObject(undefined);
            }
            Object.defineProperty(xNewData, "__xpath__", {
                value: path,
                enumerable: false,
                writable: true
            });
        }
        // 处理 xtype 类型
        else {
            xNewData = rawData;
            // NOTE: 根据 im 特性，对于 array 和 object 类型，如果内部数据改变，
            // 则溯源节点的引用都会更新，此时该节点会变成 plain 类型，会走上面的转化过程。
            // 如果是数组的变化的情况，会使得操作值包含 _xtype_, 此时需要嵌套更新
            if (xNewData.__xpath__ != path) {
                xNewData.__xpath__ = path
                switch (typeName) {
                    case 'Array':
                        // recursive call toXType(...) to transform the inner data
                        xNewData = (rawData as Array<any>).map((value: any, index: number) => {
                            return this.toXType(value, path + '.' + index)
                        }) as XType;
                        break;
                    case 'Object':
                        // recursive call toXType(...) to transform the inner data
                        for (let prop in xNewData) {
                            if (xNewData.hasOwnProperty(prop) && prop != '__xpath__') {
                                rawData[prop] = this.toXType(rawData[prop], path + '.' + prop);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

        }

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

    // -------------------------- redux 对接函数 ------------------------------
    public getReduxReducer() {
        // 只需传回 state 即可
        return () => this.state;
    }

    // -------------------------------- form 对接函数 -----------------------------
    public syncInput(state: any): (event: ChangeEvent<any>) => void {
        // 请使用对象state, 其他特殊用法未测试
        return (event: ChangeEvent<any>) => {
            this.setSync(state, event.target.value)
        }
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

export function makeRootStore(storeTree: any): Store<any>{
    let partXStoreArr: Array<XStore<any>> = [];
    let makePastateStoreToBeReducer = function(_storeTree: any): Reducer<any>{
        let node = {}
        for (const key in _storeTree) {
            if (_storeTree.hasOwnProperty(key)) {
                if(_storeTree[key].__PASTATE_STORE__){
                    node[key] = _storeTree[key].getReduxReducer();
                    partXStoreArr.push(_storeTree[key])
                }else{
                    node[key] = makePastateStoreToBeReducer(_storeTree[key])
                }
            }
        }
        return combineReducers(node);
    }
    let reduxDevTools = window['__REDUX_DEVTOOLS_EXTENSION__'] && window['__REDUX_DEVTOOLS_EXTENSION__']()
    let rootStore = createStore(makePastateStoreToBeReducer(storeTree), reduxDevTools)
    partXStoreArr.forEach( xstore => {
        xstore.dispatch = rootStore.dispatch;
    })
    return rootStore;
}

export function makeConnectedComponent(component: any, selector: string | object | Function): any {
    let selectorType = typeof selector;
    let selectFunction;
    if(selectorType == 'string'){
        selectFunction = state => {
            return {
                state: (selector as string).split('.').reduce((preValue, curValue) => {
                    return preValue[curValue]
                }, state)
            }
        }
    }else if( selectorType == 'object' ){
        selectFunction = state => {
            let selectResult = {}
            for (const key in selector as any) {
                if (selector.hasOwnProperty(key)) {
                    selectResult[key] = selector[key].split('.').reduce((preValue, curValue) => {
                        return preValue[curValue]
                    }, state)
                }
            }
            return selectResult
        }
    }else{
        selectFunction = selector
    }
    return connect(selectFunction)(component)
}