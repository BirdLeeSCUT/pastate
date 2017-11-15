// 全局 state 操作归类统计
// by 李伟鹏
// 本文件收集并统计state操作类型，并尝试进行统计，获取使用的频率，指导设计state操作API
// 到时可以规定一个统计包的格式，让社区提交自己项目的统计包
//
import { delay } from './helpers'

interface StateManageInstance<T> {
    before: T,
    after: T
}

interface StateModel {
    name: string,
    age: number,
    isMale: boolean,
    workInfo: {
        company: string
        job: string,
        salary: number,
        address: {
            province: string,
            city: string
        },
    },
    pets: [
        {
            name: string,
            animal: string,
            age: number
        }
    ]
}

const preState: StateModel = {
    name: 'Peter',
    age: 24,
    isMale: true,
    workInfo: {
        company: 'Tencent',
        job: 'developer',
        salary: 15000,
        address: {
            province: 'Guangdong',
            city: 'Shenzhen'
        }
    },
    pets: [
        {
            name: 'Kitty',
            animal: 'cat',
            age: 2
        },
        {
            name: 'Puppy',
            animal: 'dog',
            age: 1
        }
    ]
}

describe('set', function () {

    pending();

    describe('root property', function () {

        describe('value type', function () {

            it('boolean', async function () {
                let newState = TODO(preState);
                // TODO: add this in normal test
                await delay(0);
                expect(newState).toEqual({
                    ...preState,
                    isMale: false
                } as StateModel)
            })

            it('number', function () {
                let newState = TODO(preState);
                expect(newState).toEqual({
                    ...preState,
                    age: 25
                } as StateModel)
            })

            it('string', function () {
                let newState = TODO(preState);
                expect(newState).toEqual({
                    ...preState,
                    name: 'Pony'
                } as StateModel)
            })

        });

        describe('reference type: ', function () {

            it('array', function () {
                let newState = TODO(preState);
                expect(newState).toEqual({
                    ...preState,
                    pets: [
                        {
                            name: 'Amy',
                            animal: 'duck',
                            age: 1
                        }
                    ]
                } as StateModel)
            })

            it('object', function () {
                let newState = TODO(preState);
                expect(newState).toEqual({
                    ...preState,
                    workInfo: {
                        company: 'Alibaba',
                        job: 'designer',
                        salary: 15000,
                        address: {
                            province: 'Zhejiang',
                            city: 'Hangzhou'
                        }
                    }
                } as StateModel)
            })

        });

    })

    describe('nested property', function () {

        describe('2nd nested property', function () {

            it('value type', function () {
                let newState = TODO(preState);

                // Here, we can find it a bit tedious to set new value into nested property
                // in a traditional way to perform immutable characteristic
                expect(newState).toEqual({
                    ...preState,
                    workInfo: {
                        ...preState.workInfo,
                        job: 'designer'
                    }
                } as StateModel)
            })

            it('reference type', function () {
                let newState = TODO(preState);
                expect(newState).toEqual({
                    ...preState,
                    workInfo: {
                        ...preState.workInfo,
                        address: {
                            province: 'Zhejiang',
                            city: 'Hangzhou'
                        }
                    }
                } as StateModel)
            })

        });

        describe('3nd nest property', function () {

            it('a deep nest property', function () {
                let newState = TODO(preState);

                // Here, we can find it VERY tedious to set new value into DEEP nested property
                // in a traditional way to perform immutable characteristic
                expect(newState).toEqual({
                    ...preState, // ... 1
                    workInfo: {
                        ...preState.workInfo, // ... 2
                        address: {
                            ...preState.workInfo.address, // ... 3 times
                            city: 'Wenzhou'
                        }
                    }
                } as StateModel)
            })

        })

    })

})


describe('merge', function () {

    pending();

    describe('with non nested object', function () {

        it('merge with an flat object to perform as mutil set', function () {
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                name: 'Abby',
                age: 20,
                isMale: false
            } as StateModel)
        });

        it('merge with an object with an array member', function () {
            // Note: we DO NOT unfold array when merge.
            // If we want to add a new element into an array, please use the `update` method, see below.
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                name: 'Abby',
                age: 20,
                isMale: false
            } as StateModel)
        });

    })

    describe('with nested object', function () {

        it('merge with a nested object to perform as set deep nested value', function () {
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                workInfo: {
                    ...preState.workInfo,
                    company: "Alibaba",
                    job: 'designer'
                }
            } as StateModel)
        })

        it('merge with a nested object to perform as set deferent levels of nested value', function () {
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                age: 25,
                workInfo: {
                    ...preState.workInfo,
                    company: "Alibaba",
                    job: 'designer',
                    address: {
                        ...preState.workInfo.address,
                        city: 'Guangzhou'
                    }
                }
            } as StateModel)
        })

    })

})


describe('update', function () {

    pending();

    describe('update value depends on old value', function () {

        it('inscrese number', function () {
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                age: 25,
            } as StateModel)
        })

        it('switch boolean', function () {
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                isMale: false,
            } as StateModel)
        })

    })

    describe('update array by array operations', function () {

        it('push a new element into an array', function () {
            let newState = TODO(preState);
            // Here, we can find it a bit tedious insert a new element into an array.
            expect(newState).toEqual({
                ...preState,
                pets: [
                    ...preState.pets,
                    {
                        name: 'Amy',
                        animal: 'duck',
                        age: 1
                    }
                ]
            } as StateModel)
        })

        it('insert a new element into an array', function () {
            let newState = TODO(preState);
            // Here, we can find it so tedious insert a new element into an array.

            expect(newState).toEqual({
                ...preState,
                pets: [
                    ...preState.pets.slice(0, 1),
                    {
                        name: 'Amy',
                        animal: 'duck',
                        age: 1
                    },
                    ...preState.pets.slice(1)
                ]
            } as StateModel)
        })

        it('change the value of a property of an object inside an array', function () {
            let newState = TODO(preState);
            expect(newState).toEqual({
                ...preState,
                pets: [
                    ...preState.pets.slice(0, 1),
                    {
                        ...preState.pets[1],
                        age: 2 // here, we let age increase by 1
                    },
                ]
            } as StateModel)
        })

    })

})

describe('perform state manegement in async and batch way', function () {
    pending();
    // 利用 js 单线程 任务队列 调用栈 的原理实现
    // setTimeout(0) 模式 / nextTick

    // set , merge, update 
    // (1) 如果用immutablejs 实现，这些操作只是在 imutable 类型上添加操作链条 
    // (2) 如果自实现, 这些操作只是在操作队列上添加一个操作项

    // forceUpdate 方法的介绍

    it('perform state manegement in async way', async function () {
        let newState = TODO(preState);

        // FIXME: add this to every test task ?
        expect(newState).toEqual(preState);
        await delay(0);
        expect(newState).toEqual({
            ...preState,
            isMale: false
        } as StateModel)
    })

    it('perform sequence state manegements in async batch', async function () {

        let newState1 = TODO(preState); // set name
        expect(newState1).toEqual(preState);

        let newState2 = TODO(newState1); // set age
        expect(newState2).toEqual(preState);

        let newState3 = TODO(newState2); // set isMale
        expect(newState3).toEqual(preState);

        await delay(0);
        // batch set together
        expect(newState3).toEqual({
            ...preState,
            name: 'Pony',
            age: 25,
            isMale: false
        } as StateModel)
    })

    it('can use `forceUpdate` to perform managements immediately', async function(){
        let newState1 = TODO(preState); // set name
        expect(newState1).toEqual(preState);

        let newState2 = TODO(newState1); // set age
        expect(newState2).toEqual(preState);

        // TODO: store.forceUpdate();
        expect(newState2).toEqual({
            ...preState,
            name: 'Pony',
            age: 25,
        } as StateModel)

        let newState3 = TODO(newState2); // set isMale
        await delay(0);
        expect(newState3).toEqual({
            ...preState,
            name: 'Pony',
            age: 25,
            isMale: false
        } as StateModel)
    })

})

// TODO 增加 immutable characteristic 的测试
describe('immutable characteristic ordered by API', function(){
    // 基于API设计的结果组织测试
    describe('set managements', async function(){
        let newState = TODO(preState); // set a new state.name

        // 1. trace to the source, referances on the chain change 
        it('referances on the trace back chain change', function(){
            expect(newState).not.toBe(preState);
        })

        // 2. other referances unchange
        it('other referances unchange', function(){
            expect(newState.workInfo).toBe(preState.workInfo);
        })

        // FIXME: 更改上面的用例书写方式，使每个 it 只包含一个 expect

    })

    // TODO : 例子，数组的 map 操作和性能检测


})


describe('async test', function () {
    
    it('async', async function () {

    })
})

// TODO 加一个最佳实现章节，告诉用户某些情况可以用哪个API实现，并给出推荐的最佳模式

// 给一个可以操作 immutable 对象的接口

// 给出一个思想来源历程： 原始展开方法（ array.slice(0)// array.concat // Object.assign ），


function TODO(state: StateModel): StateModel {
    return { ...state }
}