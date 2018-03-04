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
    name: string;
    imState: State;
    state: State;
    preState: State;
    dispatch: Dispatch<any>;
    isQueuingOperations: boolean;
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
    constructor(initState: State, config?: {
        useSpanNumber?: boolean;
    });
    private makeRState(path, newValue?);
    getResponsiveState(imState: XType): any;
    set<T>(stateToOperate: T, newValue: T, description?: string): XStore<State>;
    setNew(literalPath: string, newValue: any, description?: string): XStore<State>;
    setSync(state: any, newValue: any): XStore<State>;
    merge<T>(stateToOperate: T, newValue: Partial<T>, description?: string): XStore<State>;
    update<T>(stateToOperate: T, updater: (value: T) => T, description?: string): XStore<State>;
    private submitOperation(rawParams);
    setOperationMarker(description: string): void;
    private tryPushOperation(operation);
    beginReduceOpertions(): void;
    forceUpdate(): void;
    setTextValue(state: any, newValue: any): void;
    sync(): void;
    private applyOperation(operation);
    static getValueByPath(rootObj: any, pathArr: Array<string>): any;
    getNewReference(pathArr: Array<string>): XType;
    toXType(rawData: any, path: string): XType | undefined | null;
    stateWillAddOperation(operation: XOperation): boolean;
    stateWillReduceOperations(): boolean;
    stateWillApplyOperation(operationIndex: number): boolean;
    stateDidAppliedOperation(info: {
        index: number;
        tookEffect: boolean;
        oldValue: any;
    }): boolean;
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
