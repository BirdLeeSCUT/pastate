import * as React from 'react';

/** 
 * pastate 双向数据绑定输入框组件
 */
export default class Input extends React.PureComponent<{
    /** 文本值 */
    value: string
    /** 输入框类型, 默认为 text */
    type?: 
        "text" // 单行文本
        | "textarea" // 多行文本
        | "password" // 密码文本
        | "number" // 纯数字文本
    /** 
     * 在文本值更新前调用，可用于实现自定义更新逻辑
     * @param newValue 将更新的新值
     * @param oldValue 原始值
     * @returns {string} 返回实际要更新的值
     */
    beforeChange?: (newValue?: string, oldValue?: string) => string
    afterChange?: (newValue?: string) => void
    disabled?: boolean
    /** [实验特性] 指定是否开启输入法输入完成才更新 state 的模式 */
    useComposedValue?: boolean
    className?: string
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
            type: this.props.type || "text",
            onCompositionStart: this.handleCompositionStart,
            onCompositionEnd: this.handleCompositionEnd,
            value: this.innerValue,
            disabled: this.props.disabled,
            className: this.props.className,
            id: this.props.id
        };
        return this.props.type  == "textarea" ?
            <textarea {...props} />
            :
            <input {...props} /> 
    }
}