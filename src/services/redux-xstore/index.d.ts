/**
 * xstore 原型定义
 */

// import { fromJS } from 'immutable';
export class XStore<State> {

    public readonly initState: State;
    public readonly mockState: State;
    public state: State;

    public actions: {
        [key: string]: Function
    }

    public mutations: {
        [key: string]: Function
    }

    // 兼容原始 reducer 的功能暂不实现
    // private reducer: Function
    // setRawReducer(reducer: (state: State, action: Object) => State): void

    // --- state操作方法 ---

    set(path: any, newValue: any): void
    // set(this.state.name, 'Pony')

    merge(path: any, newValue: any): void

    update(path: any, updater: Function): void
    
}

