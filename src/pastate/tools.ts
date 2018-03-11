import * as React from 'react';
import { XStore } from './pastore';

/**
 * 创建 pastore 的工厂函数
 */
export function createStore<State, Actions>(initState: State, actions?: Actions, middlewares?: any): XStore<State, Actions>{
    let store = new XStore<State, Actions>(initState);
    if(actions) store.actions = actions;
    if(middlewares) store.actionMiddlewares = middlewares
    return store
}

/**
 * pastate imState 对象拆包
 * @param imValue 
 */
export function unpack<T>(imValue: T): T {
    let value;
    let valueType: string = (Object.prototype.toString.call(imValue) as string).slice(8, -1);
    switch (valueType) {
        case 'String': value = imValue + ''; break;
        case 'Number': value = (imValue as any) + 0; break;
        case 'Boolean': value = (imValue as any) == true; break;
        case 'Array':
            value = (imValue as any).map((ele: any) => unpack(ele))
            break;
        case 'Object':
            value = {}
            for (const key in imValue) {
                if (imValue.hasOwnProperty(key)) {
                    value[key] = unpack(imValue[key])
                }
            }
            break;
        default: value = imValue
    }
    return value
}

/**
 * 把视图组件转为可绑定 value 的组件 
 * @param component 原始组件
 * @param valueProp 原组件的值的属性名称，默认(一般)为 value, 可以根据原组件的情况设为 checked 等
 */
export function makeBindable(component: any, valueProp?: string): any{

    class Bind extends React.Component<{
        /** 绑定的值 */
        value: any
        /** 组件内部使用的指定显示值的属性名 */
        valueProp?: string
        /** 绑定值改变后进行回调 */
        afterChange?: (newValue: any) => void
    } & Object, undefined > {

        shouldComponentUpdate(nextProps: any) {
            return nextProps.value != this.props.value
        }

        onChange = (newValue: any) => {

            let valueToSet;
            if (newValue.target) {
                valueToSet = newValue.target[ valueProp || this.props.valueProp || 'value']
            } else {
                valueToSet = newValue
            }

            let imState = this.props.value
            if (imState === null || imState === undefined) {
                throw new Error('[pastate] The binding value cannot be null or undefined. If you want to support null and undefined, you can use store + bind props.')
            }
            let store = imState.__store__
            if (!store) {
                throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
            }
            store.set(imState, valueToSet)
            store.sync()
            this.props.afterChange && this.props.afterChange(valueToSet)
        }

        render() {
            if (Array.isArray(this.props.children)) {
                throw new Error('[pastate] you can only give only one child to Bind component')
            }

            let props = (Object as any).assign({}, this.props, {
                [valueProp || this.props.valueProp || 'value']: unpack(this.props.value), // TODO 解包
                onChange: this.onChange
            })
            return React.createElement(
                component,
                props,
                this.props.children
            )
        }
    }

    return Bind as any
}

/** 
 * 把一个依赖 imState 的纯函数转化为一个带有缓存功能的纯函数
 */
export function makeCacheable<T extends Function>(rawFunction: T): T {
    let lastArguments: IArguments;
    let currentArguments: IArguments;
    let lastResult: any;
    let cacheFunction = function(){
        currentArguments = arguments;
        if(lastArguments == undefined || Array.prototype.some.call(lastArguments, function(value: any, index: number){
            return value != currentArguments[index]
        })){
            lastResult = rawFunction.apply(null, currentArguments)
            lastArguments = currentArguments
        }
        return lastResult
    }
    return cacheFunction as any
}