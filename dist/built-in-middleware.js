"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * actions log 中间件， 可以把 action 的调用情况打印出来
 */
exports.logActions = function (time, spend, args) {
    if (time === void 0) { time = true; }
    if (spend === void 0) { spend = true; }
    if (args === void 0) { args = true; }
    return function (ctx, next) {
        var before = Date.now();
        next();
        var logStr = '';
        if (time)
            logStr += '[' + (new Date()).toLocaleTimeString() + '] ';
        logStr += (ctx.store.name || '') + ' Action: ' + ctx.name + '';
        if (args) {
            console.log.apply(null, [logStr, '('].concat(Array.from(ctx.agrs), [')' + (spend ? ' ' + (Date.now() - before) + 'ms ' : '')]));
        }
        else {
            if (spend)
                logStr += ' ' + (Date.now() - before) + 'ms ';
            console.log(logStr);
        }
    };
};
/**
 * actions 同步处理中间件
 */
exports.syncActions = function (onlyMutations) {
    if (onlyMutations === void 0) { onlyMutations = false; }
    return function (ctx, next) {
        next();
        if (!onlyMutations || ctx.name.match(/^mutations./))
            ctx.store.sync();
    };
};
/**
 * actions 调用计数中间件
 */
exports.countActions = function () {
    return function (ctx, next) {
        // TODO 
    };
};
/**
 * actions stub 组件
 */
// log operation
// diff operation 
//# sourceMappingURL=built-in-middleware.js.map