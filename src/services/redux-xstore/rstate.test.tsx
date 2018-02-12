/**
 * 响应式 rstate 测试文件
 */

import { XStore, XType, XString } from './index';
import { delay } from './helpers';

interface SimpleState extends XType {
    name: string,
    age: number,
    isMale: boolean
}

class SimpleStore extends XStore<SimpleState>{}

let store = new SimpleStore({
    name: 'Peter',
    age: 10,
    isMale: true
})

describe('responsive state test suit', function () {

    describe('state init', function() {

        describe('get', function(){
            it('string', function(){
                expect(store.rstate.name).toBe(store.state.name)
            })
            it('number', function(){
                expect(store.state.age).toEqual(store.rstate.age)
            })
            it('boolean', function(){
                expect(store.state.isMale).toEqual(store.rstate.isMale)
            })
        })

        it('set', async function(){
            store.rstate.name = 'Tom'
            // store.set(store.state.name, 'Tom')
            await delay(0)
            expect(store.state.name).toEqual('Tom')
            expect(store.rstate.name).toBe(store.state.name)
        })
    })
})