
import * as React from 'react';

export default class Checkbox extends React.PureComponent<{
    checked: boolean
    disabled?: boolean
    beforeChange?: (newValue?: boolean) => boolean
    afterChange?: (newValue?: string) => void
    className?: string
    id?: string
}, any> {

    onChange = e => {
        let store = (this.props.checked as any).__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        store.setSync(this.props.checked, e.target.checked)
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