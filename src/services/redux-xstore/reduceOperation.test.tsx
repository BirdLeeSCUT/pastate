/**
 * 测试 reduce operation 的逻辑
 * - this.set
 * - this.merge
 * - this.update
 * - this.submitOperation
 */

import { XStore, XType, XString } from './index';
import { delay } from './helpers'

interface SimpleState extends XType {
    name: string,
    age: number,
    isMale: boolean,
    pets: Array<{
        name: string,
        age: number,
        isDog: boolean
    }>,
    address: {
        province: string,
        city: string,
        homeInfo: {
            isRend: {
                value: boolean
            }
        }
    }
}

let myStore = new XStore<SimpleState>({
    name: 'Peter',
    age: 10,
    isMale: true,
    pets: [
        {
            name: 'Puppy',
            age: 1,
            isDog: true
        }
    ],
    address: {
        province: 'GD',
        city: 'GZ',
        homeInfo: {
            isRend: {
                value: true
            }
        }
    }
});



describe('Test: Store.getValueByPath', function () {

    pending()

    it('root', function () {
        expect(XStore.getValueByPath(myStore.state, [])).toBe(myStore.state)
    })

    it('root prop', function () {
        expect(XStore.getValueByPath(myStore.state, ['name'])).toBe(myStore.state.name)
    })

    it('array prop', function () {
        expect(XStore.getValueByPath(myStore.state, ['pets'])).toBe(myStore.state.pets)
        expect(XStore.getValueByPath(myStore.state, ['pets', '0'])).toBe(myStore.state.pets[0])
    })

    it('nested prop', function () {
        expect(XStore.getValueByPath(myStore.state, ['pets', '0', 'name'])).toBe(myStore.state.pets[0].name)
    })

})

describe('Test: Store.updateReferenceInPath', function () {

    pending();

    myStore.preState = myStore.state;
    Object.freeze(myStore.preState);
    Object.freeze(myStore.preState.address);
    Object.freeze(myStore.preState.address.homeInfo);
    Object.freeze(myStore.preState.address.homeInfo.isRend);

    myStore.getNewReference(['address', 'homeInfo'])

    describe('update reference in path', function () {
        it('reference did updated', function () {
            expect(myStore.state).not.toBe(myStore.preState);
            expect(myStore.state.address).not.toBe(myStore.preState.address);
            expect(myStore.state.address.homeInfo).not.toBe(myStore.preState.address.homeInfo);
        })
        it('keep value and __path__ in path', function () {
            expect(myStore.state).toEqual(myStore.preState);

            expect((myStore.state as XType).__xpath__)
                .toEqual((myStore.preState as XType).__xpath__);
            expect((myStore.state.address as XType).__xpath__)
                .toEqual((myStore.preState.address as XType).__xpath__);
            expect((myStore.state.address.homeInfo as XType).__xpath__)
                .toEqual((myStore.preState.address.homeInfo as XType).__xpath__);
        })
    })

    describe('keep reference out of path', function () {
        it('keep reference out of path: brother path', function () {
            expect(myStore.state.pets).toBe(myStore.preState.pets)
        })

        it('keep reference out of path: child path', function () {
            expect(myStore.state.address.homeInfo.isRend).toBe(myStore.preState.address.homeInfo.isRend)
        })
    })

})

describe('Test: reduce operation "set" ', function () {

    pending();

    describe('primitive value test', function () {
        pending();

        it('toBe', function () {
            expect('test').toBe('test')
            expect(new String('test')).not.toBe('test')
            expect(new String('test')).not.toBe(new String('test'))
        })

        it('toEqual', function () {
            expect('test').toEqual('test')
            expect(new String('test')).toEqual('test')
            expect(new String('test')).toEqual(new String('test'))
        })
    })

    describe('set at root', function () {

        describe('simple value', function () {

            afterEach(function () {
                // 撤销产生的影响
                myStore.state = myStore.preState;
            })

            // 更新整个state值，支持但不推荐
            it('entire root state', async function () {
                myStore.preState = myStore.state;
                myStore.set(myStore.state, {
                    name: 'Amy',
                    age: 12,
                    isMale: false,
                    pets: [
                        {
                            name: 'Kitty',
                            age: 2,
                            isDog: false
                        }
                    ],
                    address: {
                        province: 'ZJ',
                        city: 'HZ',
                        homeInfo: {
                            isRend: {
                                value: false
                            }
                        }
                    }
                })

                expect(myStore.state).toEqual(myStore.preState)

                await delay(0)

                expect(myStore.state).toEqual(XStore.toXType({
                    name: 'Amy',
                    age: 12,
                    isMale: false,
                    pets: [
                        {
                            name: 'Kitty',
                            age: 2,
                            isDog: false
                        }
                    ],
                    address: {
                        province: 'ZJ',
                        city: 'HZ',
                        homeInfo: {
                            isRend: {
                                value: false
                            }
                        }
                    }
                }, ''))
            })

            it('bool', async function () {
                myStore.set(myStore.state.isMale, false)
                expect(myStore.state.isMale).toEqual(true)
                await delay(0)
                expect(myStore.state.isMale).toEqual(false)
                expect((myStore.state.isMale as XType).__xpath__).toEqual('.isMale')
                expect(myStore.state).not.toBe(myStore.preState)
                expect(myStore.state.isMale).not.toBe(myStore.preState.isMale)
            })

            it('number', async function () {
                myStore.set(myStore.state.age, 12)
                expect(myStore.state.age).toEqual(10)
                await delay(0)
                expect(myStore.state.age).toEqual(12)
                expect((myStore.state.age as XType).__xpath__).toEqual('.age')
                expect(myStore.state).not.toBe(myStore.preState)
                expect(myStore.state.age).not.toBe(myStore.preState.age)
            })

            it('string', async function () {
                myStore.set(myStore.state.name, 'Amy')
                expect(myStore.state.name).toEqual('Peter')
                await delay(0)
                expect(myStore.state.name).toEqual('Amy')
                expect((myStore.state.name as XType).__xpath__).toEqual('.name')
                expect(myStore.state).not.toBe(myStore.preState)
                expect(myStore.state.name).not.toBe(myStore.preState.name)
            })


        })

        describe('reference value', function () {
            pending()

            afterEach(function () {
                // 撤销产生的影响
                myStore.state = myStore.preState;
            })

            it('array', async function () {
                myStore.set(myStore.state.pets, [{
                    name: 'Kitty',
                    age: 2,
                    isDog: false
                }])
                expect(myStore.state.pets).toEqual(myStore.preState.pets)
                await delay(0)
                expect(myStore.state.pets).toEqual(XStore.toXType([{
                    name: 'Kitty',
                    age: 2,
                    isDog: false
                }], '.pets'))
                expect(myStore.state).not.toBe(myStore.preState)
                expect(myStore.state.pets).not.toBe(myStore.preState.pets)
            })

            it('object', async function () {
                myStore.set(myStore.state.address, {
                    province: 'ZJ',
                    city: 'HZ',
                    homeInfo: {
                        isRend: {
                            value: false
                        }
                    }
                })
                expect(myStore.state.address).toEqual(myStore.preState.address)
                await delay(0)
                expect(myStore.state.address).toEqual(XStore.toXType({
                    province: 'ZJ',
                    city: 'HZ',
                    homeInfo: {
                        isRend: {
                            value: false
                        }
                    }
                }, '.address'))
                expect(myStore.state).not.toBe(myStore.preState)
                expect(myStore.state.address).not.toBe(myStore.preState.address)
            })

        })

        describe('batch operations', function () {

            const lifeCycleFunc = [
                'stateWillReduceOperations',
                'stateWillApplyOperation',
                'stateDidAppliedOperation',
                'stateDidReducedOperations'
            ]
            let callSequence: Array<string> = [];

            /** 生命周期函数测试 */
            beforeAll(function () {
                // 尝试修改生命周期函数
                lifeCycleFunc.forEach(funcName => {
                    myStore[funcName] = function () {
                        callSequence.push(funcName)
                        return true
                    }
                })
            })

            afterEach(function () {
                // 撤销产生的影响
                myStore.state = myStore.preState;
            })

            it('batch operations test', async function () {
                /** 在实际使用中，连续设置多个同级的值，可用 merge 代替多个 set */
                let state = myStore.state;

                myStore.set(state.isMale, false)
                    .set(state.age, 12)
                    .set(state.name, 'Amy')
                    .set(state.pets, [{
                        name: 'Kitty',
                        age: 2,
                        isDog: false
                    }])
                    .set(state.address, {
                        province: 'ZJ',
                        city: 'HZ',
                        homeInfo: {
                            isRend: {
                                value: false
                            }
                        }
                    })

                expect(myStore.state).toEqual(XStore.toXType({
                    name: 'Peter',
                    age: 10,
                    isMale: true,
                    pets: [
                        {
                            name: 'Puppy',
                            age: 1,
                            isDog: true
                        }
                    ],
                    address: {
                        province: 'GD',
                        city: 'GZ',
                        homeInfo: {
                            isRend: {
                                value: true
                            }
                        }
                    }
                }, ''))

                await delay(0)

                expect(myStore.state).toEqual(XStore.toXType({
                    name: 'Amy',
                    age: 12,
                    isMale: false,
                    pets: [
                        {
                            name: 'Kitty',
                            age: 2,
                            isDog: false
                        }
                    ],
                    address: {
                        province: 'ZJ',
                        city: 'HZ',
                        homeInfo: {
                            isRend: {
                                value: false
                            }
                        }
                    }
                }, ''))

                // 生命周期函数调用检查
                expect(callSequence).toEqual([
                    lifeCycleFunc[0],
                    lifeCycleFunc[1], lifeCycleFunc[2],
                    lifeCycleFunc[1], lifeCycleFunc[2],
                    lifeCycleFunc[1], lifeCycleFunc[2],
                    lifeCycleFunc[1], lifeCycleFunc[2],
                    lifeCycleFunc[1], lifeCycleFunc[2],
                    lifeCycleFunc[3],
                ])

            })

        })

    })

    describe('set at nested prop', function () {

        afterEach(function () {
            // 撤销产生的影响
            myStore.state = myStore.preState;
        })

        it('nested object', async function () {
            myStore.set(myStore.state.address.homeInfo.isRend.value, false);
            expect(myStore.state.address.homeInfo.isRend.value).toEqual(true);

            await delay(0)
            expect(myStore.state.address.homeInfo.isRend.value).toEqual(false)
            expect((myStore.state.address.homeInfo.isRend.value as XType).__xpath__).toEqual('.address.homeInfo.isRend.value')

            // 主路引用更新
            expect(myStore.state).not.toBe(myStore.preState)
            expect(myStore.state.address).not.toBe(myStore.preState.address)
            expect(myStore.state.address.homeInfo).not.toBe(myStore.preState.address.homeInfo)
            expect(myStore.state.address.homeInfo.isRend).not.toBe(myStore.preState.address.homeInfo.isRend)

            // 旁路引用不更新
            expect(myStore.state.pets).toBe(myStore.preState.pets)
        })

        it('nested array element', async function () {
            myStore.set(myStore.state.pets[0], {
                name: 'Kitty',
                age: 2,
                isDog: false
            });
            expect(myStore.state.pets[0]).toEqual(myStore.preState.pets[0]);

            await delay(0)
            expect(myStore.state.pets[0]).toEqual(XStore.toXType({
                name: 'Kitty',
                age: 2,
                isDog: false
            }, '.pets.0'));

        })

        it('nested array object prop', async function () {
            myStore.set(myStore.state.pets[0].name, 'Kitty');
            expect(myStore.state.pets[0].name).toEqual(myStore.preState.pets[0].name);

            await delay(0)
            expect(myStore.state.pets[0].name).toEqual(XStore.toXType('Kitty', '.pets.0.name'));
        })

    })


})

describe('Test: reduce operation "merge" ', function () {

    let spy_stateDidReducedOperations: jasmine.Spy
    beforeAll(function () {
        spy_stateDidReducedOperations = spyOn(myStore, 'stateDidReducedOperations').and.callThrough()
        myStore.preState = myStore.state;
    })

    afterEach(function () {
        spy_stateDidReducedOperations.calls.reset();
        myStore.state = myStore.preState;
    })

    describe('throw Error when the partial state to reduce is not raw Object', function () {

        pending()

        it('boolean', async function () {
            myStore.merge(myStore.state.isMale, true)
            await delay(0)
            expect(spy_stateDidReducedOperations.calls.count()).toEqual(1)
            expect(spy_stateDidReducedOperations.calls.mostRecent().args[0].isDone).toEqual(false)
            expect(myStore.state.isMale).toEqual(true)
        })

        it('number', async function () {
            myStore.merge(myStore.state.age, 12)
            await delay(0)
            expect(spy_stateDidReducedOperations.calls.count()).toEqual(1)
            expect(spy_stateDidReducedOperations.calls.mostRecent().args[0].isDone).toEqual(false)
            expect(myStore.state.age).toEqual(10)
        })

        it('string', async function () {
            myStore.merge(myStore.state.name, 'Amy')
            await delay(0)
            expect(spy_stateDidReducedOperations.calls.count()).toEqual(1)
            expect(spy_stateDidReducedOperations.calls.mostRecent().args[0].isDone).toEqual(false)
            expect(myStore.state.name).toEqual('Peter')
        })

    })

    describe('can merge value at root', function () {


        it('merge simple value', async function () {
            myStore.merge(myStore.state, {
                isMale: false,
                age: 12,
                name: 'Amy'
            })
            await delay(0)
            expect(myStore.state.isMale).toEqual(false)
            expect(myStore.state.age).toEqual(12)
            expect(myStore.state.name).toEqual('Amy')
            
            // 保留未被 merge 的值
            expect(myStore.state.pets).toBe(myStore.preState.pets)
            expect(myStore.state.address).toBe(myStore.preState.address)

        })

        it('merge array value', async function () {
            myStore.merge(myStore.state, {
                pets: [{
                    name: 'Kitty',
                    age: 2,
                    isDog: false
                }]
            })
            await delay(0)
            expect(myStore.state.pets[0]).toEqual(XStore.toXType({
                name: 'Kitty',
                age: 2,
                isDog: false
            }, '.pets.0'))
        })

        it('can merge array and object, shadow merge', async function () {
            myStore.merge(myStore.state as any, {
                address: {
                    province: 'ZJ'
                }
            })
            await delay(0)
            // shadow merge
            expect(myStore.state.address).toEqual(XStore.toXType({
                province: 'ZJ'
            }, '.address'))
        })

    })

    describe('can merge value at nested prop', function () {
        it('merge through nested object', async function () {

            myStore.merge(myStore.state.address.homeInfo.isRend, {
                value: false
            })
            await delay(0)
            expect(myStore.state.address.homeInfo.isRend.value).toEqual(false)
            // 引用更新检查
            expect(myStore.state.address.homeInfo.isRend).not.toBe(myStore.preState.address.homeInfo.isRend)
            expect(myStore.state.address.homeInfo).not.toBe(myStore.preState.address.homeInfo)
            expect(myStore.state.address).not.toBe(myStore.preState.address)
            expect(myStore.state).not.toBe(myStore.preState)

        })

        it('merge through nested array', async function () {

            myStore.merge(myStore.state.pets[0], {
                age: 2,
                isDog: false,
            })
            await delay(0)
            expect(myStore.state.pets[0]).toEqual(XStore.toXType({
                age: 2,
                isDog: false,
                name: 'Puppy' // 保留原值
            }, '.pets.0'))
            // 引用更新检查
            expect(myStore.state.pets[0]).not.toBe(myStore.preState.pets[0])
            expect(myStore.state.pets).not.toBe(myStore.preState.pets)
            expect(myStore.state).not.toBe(myStore.preState)

        })


    })

})