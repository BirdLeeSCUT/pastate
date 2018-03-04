/// <reference types="react" />
import * as React from 'react';
export default class Input extends React.PureComponent<{
    value: string;
    type?: "text" | "textarea" | "password" | "number";
    beforeChange?: (newValue?: string, oldValue?: string) => string;
    afterChange?: (newValue?: string) => void;
    disabled?: boolean;
    useComposedValue?: boolean;
    className?: string;
    id?: string;
}, any> {
    constructor(props: any);
    private innerValue;
    private isComposing;
    handleChange: (e: any) => void;
    handleCompositionStart: () => void;
    handleCompositionEnd: () => void;
    updateSourceValue: () => void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
}
