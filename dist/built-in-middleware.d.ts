import { ActionMiddleware } from './pastore';
/**
 * actions log 中间件， 可以把 action 的调用情况打印出来
 */
export declare const logActions: (time?: boolean, spend?: boolean, args?: boolean) => ActionMiddleware;
/**
 * actions 同步处理中间件
 */
export declare const syncActions: (onlyMutations?: boolean) => ActionMiddleware;
/**
 * actions 在 redux 浏览器插件中进行显示的中间件
 */
export declare const dispalyActionNamesInReduxTool: (onlyMutations?: boolean) => ActionMiddleware;
