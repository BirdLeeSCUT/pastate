/// <reference types="react" />
import * as React from 'react';
export default class Checkbox extends React.PureComponent<{
    checked: boolean;
    disabled?: boolean;
    beforeChange?: (newValue?: boolean) => boolean;
    afterChange?: (newValue?: string) => void;
    className?: string;
    id?: string;
}, any> {
    onChange: (e: any) => void;
    render(): JSX.Element;
}
