/**
 * 响应式 rstate 测试文件
 */

import { XStore, XType, XString } from './index';
import { delay } from './helpers';

interface SimpleState extends XType {
    name: string,
    age: number,
    isMale: boolean,
    teacher: {
        name: string,
        age: number,
        isMale: boolean
    },
    deepNested: {
        level2: {
            value: string,
            level3: {
                value: string
            }
        }
    },
    array_plain: Array<string>,
    array_object: Array<{
        name: string,
        age: number,
        isMale: boolean
    }>,
    array_array: Array<Array<string>>
}

class SimpleStore extends XStore<SimpleState>{ }
let initState = {
    name: 'Peter',
    age: 10,
    isMale: true,
    teacher: {
        name: 'Peter',
        age: 10,
        isMale: true,
    },
    deepNested: {
        level2: {
            value: 'l2',
            level3: {
                value: 'l3'
            }
        }
    },
    array_plain: ['a0', 'a1'],
    array_object: [{
        name: 'n0',
        age: 10,
        isMale: true
    },
    {
        name: 'n1',
        age: 20,
        isMale: false
    }],
    array_array: [
        ['a00', 'a01'],
        ['a10', 'a11']
    ]
}
let store = new SimpleStore(initState);

describe('responsive state test suit', function () {

    describe('state init', function () {

        describe('root prop', function () {

            describe('get', function () {

                it('string', function () {
                    expect(store.rstate.name).toEqual(store.state.name)
                })
                it('number', function () {
                    expect(store.state.age).toEqual(store.rstate.age)
                })
                it('boolean', function () {
                    expect(store.state.isMale).toEqual(store.rstate.isMale)
                })
            })

            describe('set', function () {

                it('string', async function () {
                    store.rstate.name = 'Tom'
                    await delay(0)
                    expect(store.state.name).toEqual('Tom')
                    expect(store.rstate.name).toBe(store.state.name)
                })

                it('number', async function () {
                    store.rstate.age = 20
                    await delay(0)
                    expect(store.state.age).toEqual(20)
                    expect(store.rstate.age).toEqual(20)
                })

                it('boolean', async function () {
                    store.rstate.isMale = false
                    await delay(0)
                    expect(store.state.isMale).toEqual(false)
                    expect(store.rstate.isMale).toEqual(false)
                })

                it('async', async function () {
                    store.rstate.isMale = true
                    expect(store.state.isMale).toEqual(false)
                    expect(store.rstate.isMale).toEqual(false)
                    await delay(0)
                    expect(store.state.isMale).toEqual(true)
                    expect(store.rstate.isMale).toEqual(true)
                })
            })

        })

        describe('nested prop', function () {

            describe('object value', function () {

                describe('get', function () {
                    it('string', function () {
                        expect(store.rstate.teacher.name).toBe(store.state.teacher.name)
                    })
                    it('number', function () {
                        expect(store.state.teacher.age).toEqual(store.rstate.teacher.age)
                    })
                    it('boolean', function () {
                        expect(store.state.teacher.isMale).toEqual(store.rstate.teacher.isMale)
                    })
                })

                describe('set', function () {
                    it('string', async function () {
                        store.rstate.teacher.name = 'Tom'
                        await delay(0)
                        expect(store.state.teacher.name).toEqual('Tom')
                        expect(store.rstate.teacher.name).toBe(store.state.teacher.name)
                    })

                    it('number', async function () {
                        store.rstate.teacher.age = 20
                        await delay(0)
                        expect(store.state.teacher.age).toEqual(20)
                        expect(store.rstate.teacher.age).toEqual(20)
                    })

                    it('boolean', async function () {
                        store.rstate.teacher.isMale = false
                        await delay(0)
                        expect(store.state.teacher.isMale).toEqual(false)
                        expect(store.rstate.teacher.isMale).toEqual(false)
                    })

                    it('set total new object', async function(){
                        let newTeacher = {
                            name: 'new',
                            age: 30,
                            isMale: true
                        }
                        store.rstate.teacher = newTeacher
                        await delay(0)
                        expect(store.state.teacher).toEqual(newTeacher)
                        expect(store.rstate.teacher).toEqual(newTeacher)
                    })
                })

                describe('deep nested', function () {

                    it('level2', async function () {
                        expect(store.rstate.deepNested.level2.value).toBe(store.state.deepNested.level2.value)
                        store.rstate.deepNested.level2.value += '!'
                        await delay(0)
                        expect(store.state.deepNested.level2.value).toEqual('l2!')
                        expect(store.rstate.deepNested.level2.value).toEqual('l2!')
                    })

                    it('level3', async function () {
                        expect(store.rstate.deepNested.level2.level3.value).toBe(store.state.deepNested.level2.level3.value)
                        store.rstate.deepNested.level2.level3.value += '!'
                        await delay(0)
                        expect(store.state.deepNested.level2.level3.value).toEqual('l3!')
                        expect(store.rstate.deepNested.level2.level3.value).toEqual('l3!')
                    })

                })
            })

            describe('array value', function () {
                it('plain elements', async function () {
                    expect(store.rstate.array_plain).toEqual(store.state.array_plain)
                    store.rstate.array_plain[0] = 'new0'
                    store.rstate.array_plain[1] = 'new1'
                    await delay(0)
                    expect(store.state.array_plain).toEqual(['new0', 'new1'])
                    expect(store.rstate.array_plain).toEqual(['new0', 'new1'])
                })

                it('object elements', async function () {
                    expect(store.rstate.array_object).toEqual(store.state.array_object)
                    let newObject0 = {
                        name: 'new1',
                        age: 40,
                        isMale: true
                    }
                    let newObject1 = {
                        name: 'new2',
                        age: 50,
                        isMale: false
                    }
                    store.rstate.array_object[0].name = newObject0.name;
                    store.rstate.array_object[0].age = newObject0.age;
                    store.rstate.array_object[0].isMale = newObject0.isMale;
                    store.rstate.array_object[1] = newObject1;
                    await delay(0)
                    expect(store.state.array_object).toEqual([newObject0, newObject1])
                    expect(store.rstate.array_object).toEqual([newObject0, newObject1])
                })

                it('array elements (multi-dimensions array)', async function () {
                    expect(store.rstate.array_array).toEqual(store.state.array_array)
                    store.rstate.array_array[0][0] = 'new00';
                    store.rstate.array_array[0][1] = 'new01';
                    store.rstate.array_array[1] = ['new10', 'new11'];
                    await delay(0)
                    expect(store.state.array_array).toEqual([['new00', 'new01'], ['new10', 'new11']])
                    expect(store.rstate.array_array).toEqual([['new00', 'new01'], ['new10', 'new11']])
                })

            })
        })

    })

    describe('state change', function(){

        describe('array mutate method', function(){

            describe('push', function(){

                it('first push', async function(){
                    // 插入新元素
                    expect(store.state.array_object.length).toEqual(2)
                    let newElement = {
                        name: 'n2',
                        age: 40,
                        isMale: false
                    }
                    store.rstate.array_object.push(newElement)
                    await delay(0)
                    expect(store.state.array_object.length).toEqual(3)
                    expect(store.rstate.array_object.length).toEqual(3)
                    expect(store.state.array_object[2]).toEqual(newElement)
                    expect(store.rstate.array_object[2]).toEqual(newElement)

                    // 新元素的操作
                    store.rstate.array_object[2].name = 'n2!'
                    await delay(0)
                    expect(store.state.array_object[2].name).toEqual('n2!')
                })

                it('next push in different async batch', async function(){
                    let newElement = {
                        name: 'n3',
                        age: 50,
                        isMale: true
                    }
                    store.rstate.array_object.push(newElement)
                    await delay(0)
                    store.rstate.array_object[3].age = 100
                    await delay(0)
                    expect(store.state.array_object.length).toEqual(4)
                    expect(store.rstate.array_object.length).toEqual(4)
                    expect(store.state.array_object[3].age).toEqual(100)
                    expect(store.rstate.array_object[3].age).toEqual(100)
                })

                it('next push in the same async batch', async function(){

                    let newElement0 = {
                        name: 'new-0',
                        age: 50,
                        isMale: true
                    }

                    let newElement1 = {
                        name: 'new-1',
                        age: 50,
                        isMale: true
                    }

                    // 如果 push 是按引用传递，这里有个问题要注意，如果两个都是压入相同的引用element, 会导致无法压入第二个
                    // 遇到问题要考虑这一点：按值传递和按引用传递的控制，本框架的修改会统一用按值传递的模式实现（如果发现按引用传递则需要修改）

                    store.rstate.array_object.push(newElement0)
                    expect(store.rstate.array_object.length).toEqual(5) 
                    store.rstate.array_object.push(newElement1)
                    expect(store.rstate.array_object.length).toEqual(6)
                    await delay(0)
                    
                    expect(store.state.array_object.length).toEqual(6)
                    expect(store.state.array_object[4]).toEqual(newElement0)
                    expect(store.rstate.array_object[4]).toEqual(newElement0)
                    expect(store.state.array_object[5]).toEqual(newElement1)
                    expect(store.rstate.array_object[5]).toEqual(newElement1)
                })
            })

            describe('pop', function(){

                // 注意，此时通过 store.rstate.array_object[3] 获取的对象，已经不可以访问了，因为数据里没有第3个元素了
                it('first pop', async function(){
                    let lastValue_pop = store.rstate.array_object.pop()
                    await delay(0)
                    expect(lastValue_pop).toEqual({
                        name: 'new-1',
                        age: 50,
                        isMale: true
                    })
                    expect(store.state.array_object[5]).toEqual(undefined)
                    expect(store.state.array_object.length).toEqual(5)
                    expect(store.rstate.array_object.length).toEqual(5)
                })

                // 异步间连续操作
                it('next pop in different async batch', async function(){
                    let lastValue_pop = store.rstate.array_object.pop()
                    expect(store.rstate.array_object.length).toEqual(4)

                    await delay(0)
                    expect(store.state.array_object.length).toEqual(4)
                    expect(lastValue_pop).toEqual({
                        name: 'new-0',
                        age: 50,
                        isMale: true
                    })
                    expect(store.state.array_object[4]).toEqual(undefined)
                })

                // 异步内连续操作
                it('next pop in the same async batch', async function(){
                    let value_3 = store.state.array_object[3]
                    let value_2 = store.state.array_object[2]
                    let lastValue_pop0 = store.rstate.array_object.pop()
                    let lastValue_pop1 = store.rstate.array_object.pop()
                    expect(store.state.array_object.length).toBe(4)
                    await delay(0)
                    expect(store.state.array_object.length).toBe(2)
                    expect(lastValue_pop0).toBe(value_3)
                    expect(lastValue_pop1).toBe(value_2)
                })
            })

            describe('unshift', function(){
                it('first unshift', async function(){
                    expect(store.state.array_object.length).toBe(2)
                    let newValue = {
                        name: 'unshift-0',
                        age: 50,
                        isMale: true
                    }
                    let oldValue_0 = store.state.array_object[0]
                    let oldValue_1 = store.state.array_object[1]
                    store.rstate.array_object.unshift(newValue)
                    expect(store.state.array_object.length).toBe(2)
                    expect(store.rstate.array_object.length).toBe(3)
                    await delay(0)
                    expect(store.state.array_object.length).toBe(3)
                    expect(store.rstate.array_object[0]).toEqual(newValue)
                    expect(store.rstate.array_object[1]).toEqual(oldValue_0)
                    expect(store.rstate.array_object[2]).toEqual(oldValue_1)
                })

                it('next unshift in different async batch', async function(){
                    let newValue_0 = {
                        name: 'unshift-1',
                        age: 50,
                        isMale: true
                    }
                    let newValue_1 = {
                        name: 'unshift-2',
                        age: 50,
                        isMale: true
                    }
                    let oldArray = store.state.array_object;
                    store.rstate.array_object.unshift(newValue_0)
                    await delay(0)
                    store.rstate.array_object.unshift(newValue_1)
                    await delay(0)
                    expect(store.rstate.array_object.length).toEqual(5)
                    expect(store.rstate.array_object).toEqual([newValue_1, newValue_0, ...oldArray])
                })

                it('next unshift in the same async batch', async function(){
                    let newValue_0 = {
                        name: 'unshift-3',
                        age: 50,
                        isMale: true
                    }
                    let newValue_1 = {
                        name: 'unshift-4',
                        age: 50,
                        isMale: true
                    }
                    let oldArray = store.state.array_object
                    store.rstate.array_object.unshift(newValue_0)
                    store.rstate.array_object.unshift(newValue_1)
                    await delay(0)
                    expect(store.rstate.array_object.length).toEqual(7)
                    expect(store.rstate.array_object).toEqual([newValue_1, newValue_0, ...oldArray])
                })

            })

            describe('shift', async function(){
                
                it('first shift', async function(){
                    let oldArray = store.state.array_object
                    let shiftedObject = store.rstate.array_object.shift()
                    expect(store.state.array_object.length).toBe(7)
                    expect(store.rstate.array_object.length).toBe(6)
                    await delay(0)
                    expect(store.state.array_object).toEqual(oldArray.slice(1))
                    expect(shiftedObject).toEqual(oldArray[0])
                })

                it('next shift in different async batch', async function(){
                    let oldArray = store.state.array_object
                    let shiftedObject_0 = store.rstate.array_object.shift()
                    await delay(0)
                    let shiftedObject_1 = store.rstate.array_object.shift()
                    await delay(0)
                    expect(store.state.array_object).toEqual(oldArray.slice(2))
                    expect(shiftedObject_0).toEqual(oldArray[0])
                    expect(shiftedObject_1).toEqual(oldArray[1])
                })

                it('next shift in the same async batch', async function(){
                    let oldArray = store.state.array_object
                    let shiftedObject_0 = store.rstate.array_object.shift()
                    let shiftedObject_1 = store.rstate.array_object.shift()
                    await delay(0)
                    expect(store.state.array_object).toEqual(oldArray.slice(2))
                    expect(shiftedObject_0).toEqual(oldArray[0])
                    expect(shiftedObject_1).toEqual(oldArray[1])
                    // 注意， 连续 pop + push 混用会导致 pop 出来的元素可能出错（目前这两者存在依赖）
                    // 但是 目标数组的处理结果时正确的
                })

            })

            describe('splice', async function(){

                it('first ', async function(){

                })

                it('next  in different async batch', async function(){
                })

                it('next  in the same async batch', async function(){

                })

            })

            describe('sort', async function(){
                
            })

            describe('reverse', async function(){

            })

        })

    })

    describe('null and not null switching', async function(){

    })

})