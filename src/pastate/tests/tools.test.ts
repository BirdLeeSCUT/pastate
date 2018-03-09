
import { XStore, XType } from '../pastore';
import { makeCacheable } from '../tools';
import { delay } from './helpers';

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

let store = new XStore<State>(initState)

describe('unpack', function () {
    pending()
})

describe('makeCacheable', function () {

    // 基本的纯计算器
    let computers = {
        mergeNameAndAge: function (name: string, age: number) {
            return { name, age }
        },
        mergeNameAndAddress: function (name: string, address: any) {
            return { name, ...address }
        },
    }
    // 纯计算器的窥视器
    let computersSpy: {[x in keyof typeof computers]: jasmine.Spy} = {} as any;
    // 具有缓存功能的纯计算器
    let cacheableComputers: typeof computers = {} as any;

    // 上一个运算结果
    let lastResult: any;

    beforeAll(function () {
        for (const key in computers) {
            if (computers.hasOwnProperty(key)) {
                computersSpy[key] = spyOn(computers, key).and.callThrough()
            }
        }
        for (const key in computers) {
            if (computers.hasOwnProperty(key)) {
                cacheableComputers[key] = makeCacheable(computers[key]);
            }
        }
    })

    it('can compute in the first time', function () {

        let resultByCacheable = cacheableComputers.mergeNameAndAge(store.imState.basicInfo.name, store.imState.basicInfo.age)
        expect(computersSpy.mergeNameAndAge.calls.count()).toBe(1);  

        let resultByRaw = computers.mergeNameAndAge(store.imState.basicInfo.name, store.imState.basicInfo.age)
        expect(resultByCacheable).toEqual(resultByRaw)
        
        lastResult = resultByCacheable
    })

    it('can cache in the next time when data not change', function () {
        computersSpy.mergeNameAndAge.calls.reset()
        let resultByCacheable = cacheableComputers.mergeNameAndAge(store.imState.basicInfo.name, store.imState.basicInfo.age)
        expect(computersSpy.mergeNameAndAge.calls.count()).toBe(0);
        expect(resultByCacheable).toBe(lastResult)
    })

    it('can comput in the next time when data change', async function () {

        store.state.basicInfo.age += 1
        await delay(0)

        computersSpy.mergeNameAndAge.calls.reset()
        let resultByCacheable = cacheableComputers.mergeNameAndAge(store.imState.basicInfo.name, store.imState.basicInfo.age)
        expect(computersSpy.mergeNameAndAge.calls.count()).toBe(1);  

        let resultByRaw = computers.mergeNameAndAge(store.imState.basicInfo.name, store.imState.basicInfo.age)
        expect(resultByCacheable).toEqual(resultByRaw)
        
        lastResult = resultByCacheable
    })

    it('can cache again in the next time when data not change', function () {

        computersSpy.mergeNameAndAge.calls.reset()
        let resultByCacheable = cacheableComputers.mergeNameAndAge(store.imState.basicInfo.name, store.imState.basicInfo.age)
        expect(computersSpy.mergeNameAndAge.calls.count()).toBe(0);
        expect(resultByCacheable).toBe(lastResult)

    })
})