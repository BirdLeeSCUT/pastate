
import { XStore, XType, ActionMiddleware, MiddlewareContext } from '../pastore';
import { delay } from './helpers';
import { logActions } from '../built-in-middleware';

interface State extends XType {
    basicInfo: {
        name: string,
        age: number,
        isBoy: true
    },
    address: {
        country: string,
        city: string
    }
}

const initState: State = {
    basicInfo: {
        name: 'Peter',
        age: 5,
        isBoy: true
    },
    address: {
        country: 'China',
        city: 'GZ'
    }
}

let callLogs: Array<any> = []

const middlewaresInnerFunc = {
    beforeNext(context: any){callLogs.push('beforeNext')},
    afterNext(context: any){callLogs.push('afterNext')}
}

const actions = {
    changeName(newName: string){
        state.basicInfo.name = newName
        callLogs.push('changeName')
    },
    changeAge(newAge: number){
        state.basicInfo.age = newAge
        callLogs.push('changeAge')
    },
    mutations: {
        ageIncrease(){
            state.basicInfo.age += 1
            callLogs.push('ageIncrease')
        },
        ageDecrease(){
            state.basicInfo.age -= 1
            callLogs.push('ageDecrease')
        }
    }
}

let store = new XStore<State, typeof actions>(initState)
store.name = 'MyStore'
let state = store.state;
let middlewares: Array<ActionMiddleware> = []
middlewares.push(logActions(true, true, true))

// 切换赋值顺序
// store.actionMiddlewares = [logMiddleware];
// store.actions = actions;

describe('action middleware support', function(){

    let spy_beforeNext: jasmine.Spy;
    let spy_afterNext: jasmine.Spy; 

    let spy_actions_changeName: jasmine.Spy;
    let spy_actions_changeAge: jasmine.Spy;
    let spy_actions_ageIncrease: jasmine.Spy;
    let spy_actions_ageDecrease: jasmine.Spy;

    beforeAll(function(){
        let testMiddleware: ActionMiddleware = function (ctx: MiddlewareContext, next: Function) {
            middlewaresInnerFunc.beforeNext(ctx)
            next()
            middlewaresInnerFunc.afterNext(ctx)
        }
        spy_beforeNext = spyOn(middlewaresInnerFunc, 'beforeNext').and.callThrough()
        spy_afterNext = spyOn(middlewaresInnerFunc, 'afterNext').and.callThrough()
        middlewares.push(testMiddleware)
        store.actionMiddlewares = middlewares;

        spy_actions_changeName = spyOn(actions, 'changeName').and.callThrough()
        spy_actions_changeAge = spyOn(actions, 'changeAge').and.callThrough()
        spy_actions_ageIncrease = spyOn(actions.mutations, 'ageIncrease').and.callThrough()
        spy_actions_ageDecrease = spyOn(actions.mutations, 'ageDecrease').and.callThrough()
        store.actions = actions;

    })

    it('can run an action as expect', async function(){

        store.actions.changeName('good')
        expect(spy_actions_changeName.calls.count()).toBe(1)
        expect(spy_beforeNext.calls.count()).toBe(1)
        expect(spy_afterNext.calls.count()).toBe(1)
        expect(spy_beforeNext.calls.mostRecent().args[0].name).toBe('changeName')
        expect(spy_afterNext.calls.mostRecent().args[0].name).toBe('changeName')
        expect(callLogs).toEqual(['beforeNext', 'changeName', 'afterNext'])

        callLogs = []
        spy_actions_changeName.calls.reset()
        spy_beforeNext.calls.reset()
        spy_afterNext.calls.reset()

        await delay(0)
        expect(state.basicInfo.name).toBe('good')

    })

    it('can run two continuous action as expect', async function(){
        
        store.actions.changeName('good-1')
        store.actions.changeAge(20)
        expect(spy_actions_changeName.calls.count()).toBe(1)
        expect(spy_actions_changeAge.calls.count()).toBe(1)
        expect(spy_beforeNext.calls.count()).toBe(2)
        expect(spy_afterNext.calls.count()).toBe(2)
        expect(callLogs).toEqual(['beforeNext', 'changeName', 'afterNext', 'beforeNext', 'changeAge', 'afterNext'])

        callLogs = []
        spy_actions_changeName.calls.reset()
        spy_actions_changeAge.calls.reset()
        spy_beforeNext.calls.reset()
        spy_afterNext.calls.reset()

        await delay(0)
        expect(state.basicInfo.name).toBe('good-1')
        expect(state.basicInfo.age).toBe(20)

    })

    it('secondary actions', async function(){
        
        actions.mutations.ageIncrease()
        // actions.mutations.ageDecrease() 如果要使用连续赋值，请先 sync 或者变为 sync 中间件，指定前置 path 
        expect(spy_actions_ageIncrease.calls.count()).toBe(1)
        expect(spy_beforeNext.calls.count()).toBe(1)
        expect(spy_afterNext.calls.count()).toBe(1)
        expect(spy_beforeNext.calls.mostRecent().args[0].name).toBe('mutations.ageIncrease')
        expect(spy_afterNext.calls.mostRecent().args[0].name).toBe('mutations.ageIncrease')
        expect(callLogs).toEqual(['beforeNext', 'ageIncrease', 'afterNext'])

        await delay(0)
        expect(state.basicInfo.age).toBe(21)

    })

})


describe('built-in action middlewares', function(){

})