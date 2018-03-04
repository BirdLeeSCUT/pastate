/// <reference types="react" />
import { Store } from 'redux';
import { Provider } from 'react-redux';
export declare function makeReduxStore(storeTree: any): Store<any>;
export declare function makeContainer(component: any, selector?: string | object | Function): any;
export declare function makeOnlyContainer(component: any, store: any): JSX.Element;
export { Provider as RootContainer };
