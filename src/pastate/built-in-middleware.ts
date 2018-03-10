import { ActionMiddleware, MiddlewareContext } from './pastore'


/**
 * actions log 中间件， 可以把 action 的调用情况打印出来
 */
export const logActions = function(time: boolean = true, spend: boolean = true, args: boolean = true): ActionMiddleware {
    return function (ctx: MiddlewareContext, next: Function) {
        let before = Date.now()
        next()
        let logStr = ''
        if(time) logStr += '[' + (new Date()).toLocaleTimeString() + '] '
        logStr += (ctx.store.name || '') + ' Action: ' + ctx.name + ''
        if(args){
            console.log.apply(null, [logStr, '(', ...(Array as any).from(ctx.agrs as any), ')' + (spend ? ' ' + (Date.now() - before) + 'ms ' : '')])
        }else{
            if(spend) logStr += ' ' + (Date.now() - before) + 'ms '
            console.log(logStr)
        }
    }
}

/**
 * actions 同步处理中间件
 */
export const syncActions = function(onlyMutations: boolean = false): ActionMiddleware {
    return function (ctx: MiddlewareContext, next: Function) {
        next()
        if(!onlyMutations || ctx.name.match(/^mutations./)) ctx.store.sync()
    }
}

/** 
 * actions 调用计数中间件
 */
export const countActions = function(): ActionMiddleware {
    return function (ctx: MiddlewareContext, next: Function) {
        // TODO 
    }
}

/**
 * actions stub 组件
 */


// log operation
// diff operation