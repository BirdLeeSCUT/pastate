import * as React from 'react'

/** 
 * pastate 双向数据绑定单选框组件
 */
export default class Select extends React.PureComponent<{
    /** 选项数据数组 */
    options: Array<string | number | boolean> | Array<{value: string | number | boolean, tag: string, disabled?: boolean}> 
    /** 绑定的选中值 */
    value: string | number | boolean
    /** 传递的 id */
    id?: string
    /** 传递的 className */
    className?: string
    /** 指定禁止点击状态，默认为 false */
    disabled?: boolean
    /** 在绑定值更新后会被调用 */
    afterChange?: (value?: string | number | boolean) => void
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
                throw new Error('[pastate] Select is not support object or array value.')
        }
        store.set(this.props.value, newValue)
        this.props.afterChange && this.props.afterChange(newValue)
    }

    render() {

        return (
            <select 
                className={this.props.className} 
                id={this.props.id} 
                value={this.props.value as any} 
                disabled={this.props.disabled}
                onChange={this.onChange}
            >
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

                        return (
                            <option 
                                key={index}
                                value={option}
                                disabled={disabled}
                            >
                                {tag}
                            </option>
                        )
                    })
                }
            </select>
        )
    }
}