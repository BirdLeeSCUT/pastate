import * as React from 'react';


export default class Checkbox extends React.PureComponent<any, any> {

    onChange = e => {
        let store = this.props.checked.__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }
        store.setSync(this.props.checked, e.target.checked)
    }

    render() {
        let props = (Object as any).assign( {
            onChange: this.onChange,
        }, this.props, {
            checked: this.props.checked == true
        });
        return <input type="checkbox" {...props} />
    }
}