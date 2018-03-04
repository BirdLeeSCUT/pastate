/**
 * 响应式 rstate 测试文件
 */

import { XStore, XType, XString } from '../pastore';
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
    array_object_empty: Array<{
        name: string,
        age: number,
        isMale: boolean
    }>,
    array_array: Array<Array<string>>
}

class SimpleStore extends XStore<SimpleState>{ }
let initState: SimpleState = {
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
    array_object_empty: [],
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
                    expect(store.state.name).toEqual(store.imState.name)
                })
                it('number', function () {
                    expect(store.imState.age).toEqual(store.state.age)
                })
                it('boolean', function () {
                    expect(store.imState.isMale).toEqual(store.state.isMale)
                })
            })

            describe('set', function () {

                it('string', async function () {
                    store.state.name = 'Tom'
                    await delay(0)
                    expect(store.imState.name).toEqual('Tom')
                    expect(store.state.name).toEqual(store.imState.name)
                })

                it('number', async function () {
                    store.state.age = 20
                    await delay(0)
                    expect(store.imState.age).toEqual(20)
                    expect(store.state.age).toEqual(20)
                })

                it('boolean', async function () {
                    store.state.isMale = false
                    await delay(0)
                    expect(store.imState.isMale).toEqual(false)
                    expect(store.state.isMale).toEqual(false)
                })

                it('async', async function () {
                    store.state.isMale = true
                    expect(store.imState.isMale).toEqual(false)
                    expect(store.state.isMale).toEqual(false)
                    await delay(0)
                    expect(store.imState.isMale).toEqual(true)
                    expect(store.state.isMale).toEqual(true)
                })
            })

        })

        describe('nested prop', function () {

            describe('object value', function () {

                describe('get', function () {
                    it('string', function () {
                        expect(store.state.teacher.name).toEqual(store.imState.teacher.name)
                    })
                    it('number', function () {
                        expect(store.imState.teacher.age).toEqual(store.state.teacher.age)
                    })
                    it('boolean', function () {
                        expect(store.imState.teacher.isMale).toEqual(store.state.teacher.isMale)
                    })
                })

                describe('set', function () {
                    it('string', async function () {
                        store.state.teacher.name = 'Tom'
                        await delay(0)
                        expect(store.imState.teacher.name).toEqual('Tom')
                        expect(store.state.teacher.name).toEqual(store.imState.teacher.name)
                    })

                    it('number', async function () {
                        store.state.teacher.age = 20
                        await delay(0)
                        expect(store.imState.teacher.age).toEqual(20)
                        expect(store.state.teacher.age).toEqual(20)
                    })

                    it('boolean', async function () {
                        store.state.teacher.isMale = false
                        await delay(0)
                        expect(store.imState.teacher.isMale).toEqual(false)
                        expect(store.state.teacher.isMale).toEqual(false)
                    })

                    it('set total new object', async function () {
                        let newTeacher = {
                            name: 'new',
                            age: 30,
                            isMale: true
                        }
                        store.state.teacher = newTeacher
                        await delay(0)
                        expect(store.imState.teacher).toEqual(newTeacher)
                        expect(store.state.teacher).toEqual(newTeacher)
                    })
                })

                describe('deep nested', function () {

                    it('level2', async function () {
                        expect(store.state.deepNested.level2.value).toEqual(store.imState.deepNested.level2.value)
                        store.state.deepNested.level2.value += '!'
                        await delay(0)
                        expect(store.imState.deepNested.level2.value).toEqual('l2!')
                        expect(store.state.deepNested.level2.value).toEqual('l2!')
                    })

                    it('level3', async function () {
                        expect(store.state.deepNested.level2.level3.value).toEqual(store.imState.deepNested.level2.level3.value)
                        store.state.deepNested.level2.level3.value += '!'
                        await delay(0)
                        expect(store.imState.deepNested.level2.level3.value).toEqual('l3!')
                        expect(store.state.deepNested.level2.level3.value).toEqual('l3!')
                    })

                })
            })

            describe('array value', function () {
                it('plain elements', async function () {
                    expect(store.state.array_plain).toEqual(store.imState.array_plain)
                    store.state.array_plain[0] = 'new0'
                    store.state.array_plain[1] = 'new1'
                    await delay(0)
                    expect(store.imState.array_plain).toEqual(['new0', 'new1'])
                    expect(store.state.array_plain).toEqual(['new0', 'new1'])
                })

                it('object elements', async function () {
                    expect(store.state.array_object).toEqual(store.imState.array_object)
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
                    store.state.array_object[0].name = newObject0.name;
                    store.state.array_object[0].age = newObject0.age;
                    store.state.array_object[0].isMale = newObject0.isMale;
                    store.state.array_object[1] = newObject1;
                    await delay(0)
                    expect(store.imState.array_object).toEqual([newObject0, newObject1])
                    expect(store.state.array_object).toEqual([newObject0, newObject1])
                })

                it('array elements (multi-dimensions array)', async function () {
                    expect(store.state.array_array).toEqual(store.imState.array_array)
                    store.state.array_array[0][0] = 'new00';
                    store.state.array_array[0][1] = 'new01';
                    store.state.array_array[1] = ['new10', 'new11'];
                    await delay(0)
                    expect(store.imState.array_array).toEqual([['new00', 'new01'], ['new10', 'new11']])
                    expect(store.state.array_array).toEqual([['new00', 'new01'], ['new10', 'new11']])
                })

            })
        })

    })

    describe('state change', function () {

        describe('array mutate method', function () {

            describe('push', function () {

                it('first push', async function () {
                    // 插入新元素
                    expect(store.imState.array_object.length).toEqual(2)
                    let newElement = {
                        name: 'n2',
                        age: 40,
                        isMale: false
                    }
                    store.state.array_object.push(newElement)
                    await delay(0)
                    expect(store.imState.array_object.length).toEqual(3)
                    expect(store.state.array_object.length).toEqual(3)
                    expect(store.imState.array_object[2]).toEqual(newElement)
                    expect(store.state.array_object[2]).toEqual(newElement)

                    // 新元素的操作
                    store.state.array_object[2].name = 'n2!'
                    await delay(0)
                    expect(store.imState.array_object[2].name).toEqual('n2!')
                })

                it('next push in different async batch', async function () {
                    let newElement = {
                        name: 'n3',
                        age: 50,
                        isMale: true
                    }
                    store.state.array_object.push(newElement)
                    await delay(0)
                    store.state.array_object[3].age = 100
                    await delay(0)
                    expect(store.imState.array_object.length).toEqual(4)
                    expect(store.state.array_object.length).toEqual(4)
                    expect(store.imState.array_object[3].age).toEqual(100)
                    expect(store.state.array_object[3].age).toEqual(100)
                })

                it('next push in the same async batch', async function () {

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

                    store.state.array_object.push(newElement0)
                    expect(store.state.array_object.length).toEqual(5)
                    store.state.array_object.push(newElement1)
                    expect(store.state.array_object.length).toEqual(6)
                    await delay(0)

                    expect(store.imState.array_object.length).toEqual(6)
                    expect(store.imState.array_object[4]).toEqual(newElement0)
                    expect(store.state.array_object[4]).toEqual(newElement0)
                    expect(store.imState.array_object[5]).toEqual(newElement1)
                    expect(store.state.array_object[5]).toEqual(newElement1)
                })

                it('push into an init empty array', async function(){

                    let newElement = {
                        name: 'newElement',
                        age: 10,
                        isMale: true
                    }
                    expect(store.state.array_object_empty.length).toEqual(0)
                    store.state.array_object_empty.push(newElement);
                    await delay(0)
                    expect(store.state.array_object_empty).toEqual([newElement])
                    expect(store.state.array_object_empty.length).toEqual(1)

                    store.state.array_object_empty = []
                    await delay(0)
                })

            })

            describe('pop', function () {

                // 注意，此时通过 store.state.array_object[3] 获取的对象，已经不可以访问了，因为数据里没有第3个元素了
                it('first pop', async function () {
                    let lastValue_pop = store.state.array_object.pop()
                    await delay(0)
                    expect(lastValue_pop).toEqual({
                        name: 'new-1',
                        age: 50,
                        isMale: true
                    })
                    expect(store.imState.array_object[5]).toEqual(undefined)
                    expect(store.imState.array_object.length).toEqual(5)
                    expect(store.state.array_object.length).toEqual(5)
                })

                // 异步间连续操作
                it('next pop in different async batch', async function () {
                    let lastValue_pop = store.state.array_object.pop()
                    expect(store.state.array_object.length).toEqual(4)

                    await delay(0)
                    expect(store.imState.array_object.length).toEqual(4)
                    expect(lastValue_pop).toEqual({
                        name: 'new-0',
                        age: 50,
                        isMale: true
                    })
                    expect(store.imState.array_object[4]).toEqual(undefined)
                })

                // 异步内连续操作
                it('next pop in the same async batch', async function () {
                    let value_3 = store.imState.array_object[3]
                    let value_2 = store.imState.array_object[2]
                    let lastValue_pop0 = store.state.array_object.pop()
                    let lastValue_pop1 = store.state.array_object.pop()
                    expect(store.imState.array_object.length).toBe(4)
                    await delay(0)
                    expect(store.imState.array_object.length).toBe(2)
                    expect(lastValue_pop0).toBe(value_3)
                    expect(lastValue_pop1).toBe(value_2)
                })
            })

            describe('unshift', function () {
                it('first unshift', async function () {
                    expect(store.imState.array_object.length).toBe(2)
                    let newValue = {
                        name: 'unshift-0',
                        age: 50,
                        isMale: true
                    }
                    let oldValue_0 = store.imState.array_object[0]
                    let oldValue_1 = store.imState.array_object[1]
                    store.state.array_object.unshift(newValue)
                    expect(store.imState.array_object.length).toBe(2)
                    expect(store.state.array_object.length).toBe(3)
                    await delay(0)
                    expect(store.imState.array_object.length).toBe(3)
                    expect(store.state.array_object[0]).toEqual(newValue)
                    expect(store.state.array_object[1]).toEqual(oldValue_0)
                    expect(store.state.array_object[2]).toEqual(oldValue_1)
                })

                it('next unshift in different async batch', async function () {
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
                    let oldArray = store.imState.array_object;
                    store.state.array_object.unshift(newValue_0)
                    await delay(0)
                    store.state.array_object.unshift(newValue_1)
                    await delay(0)
                    expect(store.state.array_object.length).toEqual(5)
                    expect(store.state.array_object).toEqual([newValue_1, newValue_0, ...oldArray])
                })

                it('next unshift in the same async batch', async function () {
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
                    let oldArray = store.imState.array_object
                    store.state.array_object.unshift(newValue_0)
                    store.state.array_object.unshift(newValue_1)
                    await delay(0)
                    expect(store.state.array_object.length).toEqual(7)
                    expect(store.state.array_object).toEqual([newValue_1, newValue_0, ...oldArray])
                })

                it('unshift into an init empty array', async function(){
                    let newElement = {
                        name: 'newElement',
                        age: 10,
                        isMale: true
                    }
                    expect(store.state.array_object_empty.length).toEqual(0)
                    store.state.array_object_empty.push(newElement);
                    await delay(0)
                    expect(store.state.array_object_empty).toEqual([newElement])
                    expect(store.state.array_object_empty.length).toEqual(1)
                    store.state.array_object_empty = []
                    await delay(0)
                })

            })

            describe('shift', async function () {

                it('first shift', async function () {
                    let oldArray = store.imState.array_object
                    let shiftedObject = store.state.array_object.shift()
                    expect(store.imState.array_object.length).toBe(7)
                    expect(store.state.array_object.length).toBe(6)
                    await delay(0)
                    expect(store.state.array_object).toEqual(oldArray.slice(1))
                    expect(shiftedObject).toEqual(oldArray[0])
                })

                it('next shift in different async batch', async function () {
                    let oldArray = store.imState.array_object
                    let shiftedObject_0 = store.state.array_object.shift()
                    await delay(0)
                    let shiftedObject_1 = store.state.array_object.shift()
                    await delay(0)
                    expect(store.state.array_object).toEqual(oldArray.slice(2))
                    expect(shiftedObject_0).toEqual(oldArray[0])
                    expect(shiftedObject_1).toEqual(oldArray[1])
                })

                it('next shift in the same async batch', async function () {
                    let oldArray = store.imState.array_object
                    let shiftedObject_0 = store.state.array_object.shift()
                    let shiftedObject_1 = store.state.array_object.shift()
                    await delay(0)
                    expect(store.state.array_object).toEqual(oldArray.slice(2))
                    expect(shiftedObject_0).toEqual(oldArray[0])
                    expect(shiftedObject_1).toEqual(oldArray[1])
                    // 注意， 连续 pop + push 混用会导致 pop 出来的元素可能出错（目前这两者存在依赖）
                    // 但是 目标数组的处理结果时正确的
                })

            })

            describe('splice', function () {

                it('can splice', async function () {
                    let newValue_0 = {
                        name: 'splice-0',
                        age: 50,
                        isMale: true
                    }
                    let newValue_1 = {
                        name: 'splice-1',
                        age: 50,
                        isMale: true
                    }
                    let newValue_2 = {
                        name: 'splice-2',
                        age: 50,
                        isMale: true
                    }
                    let newValue_3 = {
                        name: 'splice-2',
                        age: 50,
                        isMale: true
                    }
                    let oldArray = store.imState.array_object;
                    store.state.array_object.push(newValue_0)
                    store.state.array_object.push(newValue_1)
                    store.state.array_object.push(newValue_2)
                    await delay(0)
                    let poppedElements = store.state.array_object.splice(2, 2, newValue_3)
                    await delay(0)
                    expect(store.state.array_object.length).toEqual(4)
                    expect(poppedElements).toEqual([newValue_0, newValue_1])
                    expect(store.state.array_object[2]).toEqual(newValue_3)
                    expect(store.state.array_object[3]).toEqual(newValue_2)
                    expect(store.imState.array_object[2]).toEqual(newValue_3)
                    expect(store.imState.array_object[3]).toEqual(newValue_2)
                    expect((store.imState.array_object[3].age as XType).__xpath__).toEqual('.array_object.3.age')
                })

            })

            describe('sort', function () {
                it('can sort', async function () {
                    store.state.array_object[1].age = 2;
                    store.state.array_object[2].age = 1;
                    store.state.array_object[0].age = 3;
                    store.state.array_object[3].age = 0;
                    await delay(0)
                    store.state.array_object.sort((a, b) => a.age - b.age)
                    await delay(0)
                    expect(store.state.array_object.map(v => v.age)).toEqual([0, 1, 2, 3])
                })

            })

            describe('reverse', async function () {
                it('can reverse', async function () {
                    store.state.array_object.reverse()
                    await delay(0)
                    expect(store.state.array_object.map(v => v.age)).toEqual([3, 2, 1, 0])
                })
            })

        })

    })

    describe('null situation', function () {

        // NOTE: 虽然支持设为null值，但是一般不建议用null值

        describe('plain node', function () {

            it('string', async function(){

                // to be null
                (store.state.teacher.name as any) = null;
                await delay(0);
                expect(store.imState.teacher.name).toEqual(null);
                expect(store.state.teacher.name).toEqual(null);

                // to be not null
                store.state.teacher.name = 'new teacher';
                await delay(0);
                expect(store.imState.teacher.name).toEqual('new teacher');
                expect(store.state.teacher.name).toEqual('new teacher');

            })

            it('number', async function(){

                // to be null
                (store.state.teacher.age as any) = null;
                await delay(0);
                expect(store.imState.teacher.age).toEqual(null);
                expect(store.state.teacher.age).toEqual(null);

                // to be not null
                store.state.teacher.age = 100;
                await delay(0);
                expect(store.imState.teacher.age).toEqual(100);
                expect(store.state.teacher.age).toEqual(100);

            })

            it('boolean', async function(){

                // to be null
                (store.state.teacher.isMale as any) = null;
                await delay(0);
                expect(store.imState.teacher.isMale).toEqual(null);
                expect(store.state.teacher.isMale).toEqual(null);

                // to be not null
                store.state.teacher.isMale = true;
                await delay(0);
                expect(store.imState.teacher.isMale).toEqual(true);
                expect(store.state.teacher.isMale).toEqual(true);
            })

        })

        describe('object node', function () {

            it('make an object to be null', async function () {
                (store.state.teacher as any) = null;
                await delay(0);
                expect(store.imState.teacher).toEqual(null);
                expect(store.state.teacher).toEqual(null);
            })

            it('make null to be an object', async function () {
                // 注意，新对象的结构要一致（正常业务逻辑下是一致的）
                let newValue = {
                    name: 'Boy',
                    age: 20,
                    isMale: true
                }
                store.state.teacher = newValue
                await delay(0);
                expect(store.imState.teacher).toEqual(newValue);
                expect(store.state.teacher).toEqual(newValue);

                store.state.teacher.name = 'Good'
                await delay(0);
                expect(store.imState.teacher.name).toEqual('Good');
            })
        })

        describe('array node', function () {

            it('make an array to be empty array', async function () {
                store.state.array_object = [];
                await delay(0);
                expect(store.imState.array_object).toEqual([]);
                expect(store.state.array_object).toEqual([]);
            })

            it('make middle empty array to return same stucture array', async function () {
                // 注意，目前用方法二实现，新数组的结构不一定要要一致（正常业务逻辑下是一致的）
                // 如果用方法一实现则需要，方法一性能会高一些
                let newElement = {
                    name: 'not empty array',
                    age: 20,
                    isMale: true
                }
                let newArray = [newElement, newElement, newElement]
                store.state.array_object = newArray
                await delay(0);
                expect(store.imState.array_object).toEqual(newArray);
                expect(store.state.array_object).toEqual(newArray);

                store.state.array_object[2].name = 'new value'
                await delay(0);
                expect(store.imState.array_object[2].name).toEqual('new value');
                expect(store.state.array_object[2].name).toEqual('new value');
            })

            it('make initial empty array to be not empty array', async function () {
                let newElement = {
                    name: 'not empty array',
                    age: 20,
                    isMale: true
                }
                let newArray = [newElement, newElement, newElement]
                store.state.array_object_empty = newArray
                await delay(0);
                expect(store.imState.array_object_empty).toEqual(newArray);
                expect(store.state.array_object_empty).toEqual(newArray);

                store.state.array_object_empty[2].name = 'new value'
                await delay(0);
                expect(store.imState.array_object_empty[2].name).toEqual('new value');
                expect(store.state.array_object_empty[2].name).toEqual('new value');
            })

            it('make array to be another array', async function () {
                // 注意，目前用方法二实现，新数组的结构不一定要要一致（正常业务逻辑下是一致的）
                // 如果用方法一实现则需要，方法一性能会高一些
                let newElement = {
                    name: 'another array',
                    age: 21,
                    isMale: false
                }
                let newArray = [newElement, newElement]
                store.state.array_object = newArray
                await delay(0);
                expect(store.imState.array_object).toEqual(newArray);
                expect(store.state.array_object).toEqual(newArray);

                store.state.array_object[1].name = 'new value'
                await delay(0);
                expect(store.imState.array_object[1].name).toEqual('new value');
                expect(store.state.array_object[1].name).toEqual('new value');
            })

            it('array and null switching', async function () {
                // 支持设 array 为 null 但是不推荐，请使用 [] 代替

                // to be null
                (store.state.array_object as any) = null
                await delay(0);
                expect(store.imState.array_object).toEqual(null);
                expect(store.state.array_object).toEqual(null);
                
                // to be array
                let newElement = {
                    name: 'another array',
                    age: 21,
                    isMale: false
                }
                let newArray = [newElement, newElement]
                store.state.array_object = newArray
                await delay(0);
                expect(store.imState.array_object).toEqual(newArray);
                expect(store.state.array_object).toEqual(newArray);

                store.state.array_object[1].name = 'new value'
                await delay(0);
                expect(store.imState.array_object[1].name).toEqual('new value');
                expect(store.state.array_object[1].name).toEqual('new value');
            })
        })

    })

    describe('get rstate', function(){
        it('root', function(){
            expect(store.getResponsiveState(store.imState)).toBe(store.state)
        })
        it('nest', function(){
            expect(store.getResponsiveState(store.imState.age as XType)).toBe(store.state.age)
            expect(store.getResponsiveState(store.imState.teacher as XType)).toBe(store.state.teacher)
            expect(store.getResponsiveState(store.imState.teacher.name as XType)).toBe(store.state.teacher.name)
        })
    })

})