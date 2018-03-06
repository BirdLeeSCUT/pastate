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
