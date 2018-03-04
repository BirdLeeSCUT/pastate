
import * as React from 'react';

/** 
 * pastate 双向数据绑定复选框组件
 */
export default class Checkbox extends React.PureComponent<{
    /** 组件值 */
    checked: boolean
    disabled?: boolean
    afterChange?: (newValue?: boolean) => void
    className?: string
    id?: string
}, any> {

    onChange = e => {
        let store = (this.props.checked as any).__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        let newValue = e.target.checked;
        store.setSync(this.props.checked, newValue)
        this.props.afterChange && this.props.afterChange(newValue)
    }

    render() {
        let props = {
            onChange: this.onChange,
            checked: this.props.checked == true,
            disabled: this.props.disabled,
            className: this.props.className,
            id: this.props.id
        };
        return <input type="checkbox" {...props} />
    }
}