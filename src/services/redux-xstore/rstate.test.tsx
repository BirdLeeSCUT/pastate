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

let store = new SimpleStore({
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
})

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
})