// 全局 state 操作归类统计
// by 李伟鹏
// 本文件收集并统计state操作类型，并尝试进行统计，获取使用的频率，指导设计state操作API
// 到时可以规定一个统计包的格式，让社区提交自己项目的统计包
//

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

    describe('root property', function () {

        describe('value type', function () {

            it('boolean', function () {
                let newState = TODO(preState);
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

describe('perfomr state manegement in async way / btach handle', function () {
    // 利用 js 单线程 任务队列 调用栈 的原理实现
    // setTimeout(0) 模式 / nextTick

    // set , merge, update 
    // (1) 如果用immutablejs 实现，这些操作只是在 imutable 类型上添加操作链条 
    // (2) 如果自实现, 这些操作只是在操作队列上添加一个操作项

    // forceUpdate 方法的介绍

})

describe('async test', function () {
    it('async', function () {
        // await Promise.resolve();
    })
})


function TODO(state: StateModel): StateModel {
    return { ...state }
}