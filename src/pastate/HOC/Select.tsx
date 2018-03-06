import * as React from 'react'

/** 
 * pastate 双向数据绑定单选框组件
 */
export default class Select extends React.PureComponent<{
    /** 选项数据数组 */
    options: Array<string> | Array<{value: string, tag: string, disabled?: boolean}> 
    /** 绑定的选中值 */
    value: string
    /** 传递的 id */
    id?: string
    /** 传递的 className */
    className?: string
    /** 指定禁止点击状态，默认为 false */
    disabled?: boolean
    /** 在绑定值更新后会被调用 */
    afterChange?: (value?: string) => void
}, any> {

    onChange = (e) => {
        let store = (this.props.value as any).__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        store.setSync(this.props.value, e.target.value)
        this.props.afterChange && this.props.afterChange(e.target.value)
    }

    render() {

        return (
            <select 
                className={this.props.className} 
                id={this.props.id} 
                value={this.props.value} 
                disabled={this.props.disabled}
                onChange={this.onChange}
            >
                {
                    (this.props.options as Array<any>).map((rawOption, index) => {

                        let optionsTypeName: string = (Object.prototype.toString.call(rawOption) as string).slice(8, -1);
                        
                        let option: string;
                        let tag: string;
                        let disabled: boolean;
                        if(optionsTypeName == "String"){
                            option = rawOption as string;
                            tag = rawOption as string;
                            disabled = false;
                        }else{
                            option = (rawOption as any).value;
                            tag = (rawOption as any).tag;
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