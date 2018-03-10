
import { XStore, XType, ActionMiddleware, MiddlewareContext } from '../pastore';
import { delay } from './helpers';
import { logActions, syncActions } from '../built-in-middleware';

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
    afterNext(context: any){callLogs.push('afterNext')},
    beforeNext1(context: any){callLogs.push('beforeNext1')},
    afterNext1(context: any){callLogs.push('afterNext1')},
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

const actions1 = {
    changeName(newName: string){
        state1.basicInfo.name = newName
        callLogs.push('changeName')
    }
}

const actions2 = {
    ageIncrease(){
        state2.basicInfo.age += 1
    },
    mutations: {
        ageIncrease(){
            state2.basicInfo.age += 1
        }
    }
}

let store = new XStore<State, typeof actions>(initState)
store.name = 'MyStore'
let state = store.state;

let store1 = new XStore<State, typeof actions1>(initState)
store1.name = 'MyStore1'
let state1 = store1.state;

let store2 = new XStore<State, typeof actions2>(initState)
store2.name = 'MyStore2'
let state2 = store2.state
store2.actions = actions2
store2.actionMiddlewares = [syncActions(true)]


// 切换赋值顺序
// store.actionMiddlewares = [logMiddleware];
// store.actions = actions;
let testMiddleware: ActionMiddleware = function (ctx: MiddlewareContext, next: Function) {
    middlewaresInnerFunc.beforeNext(ctx)
    next()
    middlewaresInnerFunc.afterNext(ctx)
}

let testMiddleware1: ActionMiddleware = function (ctx: MiddlewareContext, next: Function) {
    middlewaresInnerFunc.beforeNext1(ctx)
    next()
    middlewaresInnerFunc.afterNext1(ctx)
}


describe('action middleware support', function(){

    let spy_beforeNext: jasmine.Spy;
    let spy_afterNext: jasmine.Spy; 
    let spy_beforeNext1: jasmine.Spy;
    let spy_afterNext1: jasmine.Spy; 

    let spy_actions_changeName: jasmine.Spy;
    let spy_actions1_changeName: jasmine.Spy;
    let spy_actions_changeAge: jasmine.Spy;
    let spy_actions_ageIncrease: jasmine.Spy;
    let spy_actions_ageDecrease: jasmine.Spy;

    beforeAll(function(){

        spy_beforeNext = spyOn(middlewaresInnerFunc, 'beforeNext').and.callThrough()
        spy_afterNext = spyOn(middlewaresInnerFunc, 'afterNext').and.callThrough()

        spy_beforeNext1 = spyOn(middlewaresInnerFunc, 'beforeNext1').and.callThrough()
        spy_afterNext1 = spyOn(middlewaresInnerFunc, 'afterNext1').and.callThrough()

        store.actionMiddlewares = [testMiddleware];
        store1.actionMiddlewares = [testMiddleware, testMiddleware1];

        spy_actions_changeName = spyOn(actions, 'changeName').and.callThrough()
        spy_actions_changeAge = spyOn(actions, 'changeAge').and.callThrough()
        spy_actions_ageIncrease = spyOn(actions.mutations, 'ageIncrease').and.callThrough()
        spy_actions_ageDecrease = spyOn(actions.mutations, 'ageDecrease').and.callThrough()
        spy_actions1_changeName = spyOn(actions1, 'changeName').and.callThrough()

        store.actions = actions
        store1.actions = actions1

    })

    it('can run an action as expect', async function(){

        actions.changeName('good')
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
        
        actions.changeName('good-1')
        actions.changeAge(20)
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

        callLogs = []
        spy_actions_ageIncrease.calls.reset()
        spy_beforeNext.calls.reset()
        spy_afterNext.calls.reset()

        await delay(0)
        expect(state.basicInfo.age).toBe(21)

    })

    it('two middleware', async function(){

        actions1.changeName('good-2')
        expect(spy_actions1_changeName.calls.count()).toBe(1)
        expect(spy_beforeNext.calls.count()).toBe(1)
        expect(spy_afterNext.calls.count()).toBe(1)
        expect(spy_beforeNext1.calls.count()).toBe(1)
        expect(spy_afterNext1.calls.count()).toBe(1)
        expect(callLogs).toEqual(['beforeNext', 'beforeNext1', 'changeName', 'afterNext1',  'afterNext'])

        callLogs = []
        spy_actions1_changeName.calls.reset()
        spy_beforeNext.calls.reset()
        spy_afterNext.calls.reset()
        spy_beforeNext1.calls.reset()
        spy_afterNext1.calls.reset()

        await delay(0)
        expect(state1.basicInfo.name).toBe('good-2')

    })

})


describe('built-in action middlewares', function(){

    describe('syncActions', function(){

        it('not sync plian actions', function(){
            actions2.ageIncrease()
            actions2.ageIncrease()
            store2.sync()
    
            expect(store2.state.basicInfo.age).toBe(6)
        })
    
        it('sync mutations', function(){
            actions2.mutations.ageIncrease()
            actions2.mutations.ageIncrease()
    
            expect(store2.state.basicInfo.age).toBe(8)
    
        })
    })

})