/// <reference types="react" />
import { Store } from 'redux';
export declare function combineStores(storeTree: any): Store<any>;
export declare function makeContainer(component: any, selector?: string | object | Function): any;
/**
 * 生成唯一容器
 * @param component 视图组件
 * @param store 数据 store
 */
export declare function makeOnlyContainer(component: any, store: any): JSX.Element;
/**
 * 生成 pastate 根应用
 * @param RootContainer 模块的 container 对象
 * @param combinedStore 合成的 store
 */
export declare function makeApp(rootContainer: any, combinedStore: any): JSX.Element;
