import * as React from "react";
import { XStore } from '../index';

interface InputProps {
    value: any,
    store: XStore<any>,
    onChange?: (value: any) => void
}

const Input: React.StatelessComponent<InputProps> = ({ value, store, onChange }) => {
    return (
        <input
            type="text"
            value={value}
            onChange={function (e: any) {
                store.syncInput(value)(e)
                onChange && onChange(e.target.value)
            }}
        />
    )
}

export default Input