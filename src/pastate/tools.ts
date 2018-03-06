import * as React from 'react';

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

export function makeBindable(component: any): any{

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
            
            console.log(newValue)

            let valueToSet;
            if (newValue.target) {
                valueToSet = newValue.target[this.props.valueProp || 'value']
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
            store.setSync(imState, valueToSet)
            this.props.afterChange && this.props.afterChange(valueToSet)
        }

        render() {
            if (Array.isArray(this.props.children)) {
                throw new Error('[pastate] you can only give only one child to Bind component')
            }

            let props = (Object as any).assign({}, this.props, {
                [this.props.valueProp || 'value']: unpack(this.props.value), // TODO 解包
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