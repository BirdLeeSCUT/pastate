import * as React from 'react'

/** 
 * pastate 双向数据绑定单选框组件
 */
export default class RadioGroup extends React.PureComponent<{
    /** 选项数组 */
    options: Array<string | number | boolean> | Array<{value: string | number | boolean, tag: string, disabled?: boolean}> 
    /** 绑定的选中值 */
    value: string | number | boolean
    /** 指定禁止选择状态，默认为 false */
    disabled?: boolean
    /** 在绑定值更新后会被调用 */
    afterChange?: (value?: string | number | boolean) => void
    /** 传递给选项组根元素的 id */
    id?: string
    /** 传递给选项组根元素的 className */
    className?: string
    /** 传递给圆形按钮的 className */
    radioClassName?: string
    /** 传递给选项标签的 className */
    tagClassName?: string
    /** 传递给禁用状态的选项标签的**附加**的 className */
    disabledTagClassName?: string
    /** 指定为垂直排列状态，默认为 false */
    vertical?: boolean
}, any> {


    onChange = (e) => {
        let store = (this.props.value as any).__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        let newValue: any;
        let optionsTypeName: string = (Object.prototype.toString.call(this.props.value) as string).slice(8, -1);
        switch(optionsTypeName){
            case 'String': newValue = e.target.value; break;
            case 'Number': newValue = + e.target.value; break;
            case 'Boolean': newValue = e.target.value == 'true'; break;
            default: 
                throw new Error('[pastate] RadioGroup is not support object or array value.')
        }
        store.set(this.props.value, newValue)
        this.props.afterChange && this.props.afterChange(newValue)
    }

    render() {
        return (
            <span className={this.props.className} id={this.props.id}>
                {
                    (this.props.options as Array<any>).map((rawOption, index) => {

                        let optionsTypeName: string = (Object.prototype.toString.call(rawOption) as string).slice(8, -1);
                        let option: string;
                        let tag: string;
                        let disabled: boolean;

                        if(optionsTypeName == "String" || optionsTypeName == "Number" || optionsTypeName == "Boolean"){
                            option = rawOption as string + '';
                            tag = rawOption as string + '';
                            disabled = false;
                        }else{
                            option = (rawOption as any).value + '';
                            tag = (rawOption as any).tag + '';
                            disabled = (rawOption as any).disabled == true;
                        }

                        this.props.disabled && (disabled = true)

                        let spanClassName = '';
                        spanClassName += this.props.tagClassName || ''
                        spanClassName += (disabled && (this.props.disabledTagClassName && (' ' + this.props.disabledTagClassName))) || ''

                        return (
                            <span key={index} style={{marginRight: 4, display: this.props.vertical == true ? "block" : "inline-bock"}}>
                                <input 
                                    type="radio"
                                    checked={this.props.value + '' == option}
                                    value={option}
                                    disabled={disabled}
                                    onChange={this.onChange}
                                    className={this.props.radioClassName}
                                />
                                <span className={spanClassName}>{tag}</span>
                            </span>
                        )
                    })
                }
            </span>
        )
    }
}