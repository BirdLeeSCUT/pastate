import * as React from 'react';

export default class Input extends React.PureComponent<{
    value: string,
    beforeChange?: (newValue?: string, oldValue?: string) => string
    afterChange?: (newValue: string) => void
    textarea?: boolean,
    disabled?: boolean,
    useComposedValue?: boolean,
    className?: string,
    id?: string
}, any> {

    constructor(props: any){
        super(props);
        this.innerValue = this.props.value;
        this.isComposing = false
    }

    private innerValue: string
    private isComposing: boolean

    handleChange = e => {
        this.innerValue = e.target.value;
        this.forceUpdate()

        if(this.isComposing == false){
            this.updateSourceValue()
        }
    }

    handleCompositionStart = () => {
        if(this.props.useComposedValue == true){
            this.isComposing = true
        }
    }

    handleCompositionEnd = () => {
        if(this.props.useComposedValue == true && this.isComposing){
            this.isComposing = false
            this.updateSourceValue()
        }
    }

    updateSourceValue = () => {
        let store = (this.props.value as any).__store__
        if(!store){
            throw new Error('[pastate] You can only give state node from this.props to pastate two-ways binding HOC component')
        }

        if(this.props.beforeChange){
            let oldValue = this.props.value + '';
            let result = this.props.beforeChange(this.innerValue, oldValue)
            if(result != this.innerValue){
                this.innerValue = result;
                this.forceUpdate()
            }
        }
        store.setSync(this.props.value, this.innerValue)
        this.props.afterChange && this.props.afterChange(this.innerValue)
    }

    componentWillReceiveProps(nextProps: any){
        this.innerValue = nextProps.value
    }

    render() {
        let props = {
            onChange: this.handleChange,
            type: "text",
            onCompositionStart: this.handleCompositionStart,
            onCompositionEnd: this.handleCompositionEnd,
            value: this.innerValue,
            disabled: this.props.disabled,
            className: this.props.className,
            id: this.props.id
        };
        return this.props.textarea == true ?
            <textarea {...props} />
            :
            <input {...props} /> 
    }
}