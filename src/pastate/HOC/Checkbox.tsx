
import * as React from 'react';

export default class Checkbox extends React.PureComponent<{
    /** 组件值 */
    checked: boolean
    disabled?: boolean
    /** 
     * 在更新前会被调用，可自定义更新逻辑
     * @returns
     */
    beforeChange?: (newValue?: boolean) => boolean
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
        if(this.props.beforeChange){
            newValue = this.props.beforeChange(newValue);
        }
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