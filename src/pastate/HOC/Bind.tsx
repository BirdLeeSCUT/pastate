import * as React from 'react';
import { unpack } from '../tools';

/** 
 * pastate 双向数据绑定复选框组件
 * 优点： 
 * 1.可以快捷地匿名使用，不用定义新的组件名
 * 2.类型提示完善
 * 缺点: 
 * 1. 不便于复用
 * 2. 不是最优运行效率模式
 */
export default class Bind extends React.Component<{
    /** 绑定的值 */
    value: any
    /** 组件内部使用的指定显示值的属性名 */
    valueProp?: string
    /** 绑定值改变后进行回调 */
    afterChange?: (newValue: any) => void
} & Object, any> {

    shouldComponentUpdate(nextProps: any){
        return nextProps.value != this.props.value
    }

    onChange = (newValue: any) => {

        let valueToSet;

        if(newValue.target){
            valueToSet = newValue.target[this.props.valueProp || 'value']
        }else{
            valueToSet = newValue
        }

        let imState = this.props.value
        if(imState === null || imState === undefined){
            throw new Error('[pastate] The binding value cannot be null or undefined. If you want to support null and undefined, you can use store + bind props.')
        }
        let store = imState.__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        store.set(imState, valueToSet)
        store.currentActionName = '[binding]'
        store.sync()
        this.props.afterChange && this.props.afterChange(valueToSet)
    }

    render() {
        let element: any = this.props.children;
        
        if(Array.isArray(element)){
            element = element.filter(function(ele: string){
                return typeof ele != 'string'
            }) as any
            if(element.length == 1){
                element = element[0]
            }else{
                throw new Error('[pastate] you can only give only one child to Bind component')
            }
        }
        let component = element.type
        let props = (Object as any).assign({}, this.props, element.props, {
            [this.props.valueProp || 'value']: unpack(this.props.value), // TODO 解包
            onChange: this.onChange
        })
        return React.createElement(
            component,
            props,
            element.props.children
        )
    }
}