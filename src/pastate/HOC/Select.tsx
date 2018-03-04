import * as React from 'react'

/** 
 * pastate 双向数据绑定单选框组件
 */
export default class Select extends React.PureComponent<{
    /** 选项数组 */
    options: Array<string> | Array<{value: string, disabled?: boolean}> 
    /** 被选择的数据 */
    selected: string
    id?: string
    className?: string
    disabled?: boolean
    afterChange?: (value?: string) => void
}, any> {

    onChange = (e) => {
        let store = (this.props.selected as any).__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        store.setSync(this.props.selected, e.target.value)
        this.props.afterChange && this.props.afterChange(e.target.value)
    }

    render() {
        return (
            <select 
                className={this.props.className} 
                id={this.props.id} 
                value={this.props.selected} 
                disabled={this.props.disabled}
                onChange={this.onChange}
            >
                {
                    (this.props.options as Array<any>).map((rawOption, index) => {

                        let optionsTypeName: string = (Object.prototype.toString.call(rawOption) as string).slice(8, -1);
                        
                        let option: string;
                        let disabled: boolean;
                        if(optionsTypeName == "String"){
                            option = rawOption as string;
                            disabled = false;
                        }else{
                            option = (rawOption as any).value;
                            disabled = (rawOption as any).disabled == true;
                        }

                        return (
                            <option 
                                key={index}
                                value={option}
                                disabled={disabled}
                            >
                                {option}
                            </option>
                        )
                    })
                }
            </select>
        )
    }
}