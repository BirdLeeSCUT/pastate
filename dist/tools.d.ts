import { XStore } from './pastore';
/**
 * 创建 pastore 的工厂函数
 */
export declare function createStore<State, Actions>(descriptor: {
    name: string;
    initState: State;
    actions?: Actions;
    middlewares?: Array<any>;
}): XStore<State, Actions>;
/**
 * pastate imState 对象拆包
 * @param imValue
 */
export declare function unpack<T>(imValue: T): T;
/**
 * 把视图组件转为可绑定 value 的组件
 * @param component 原始组件
 * @param valueProp 原组件的值的属性名称，默认(一般)为 value, 可以根据原组件的情况设为 checked 等
 */
export declare function makeBindable(component: any, valueProp?: string): any;
/**
 * 把一个依赖 imState 的纯函数转化为一个带有缓存功能的纯函数
 */
export declare function makeCacheable<T extends Function>(rawFunction: T): T;
