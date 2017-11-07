/**
 * 测试添加 operation 的逻辑
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

describe("Add Operation Test Suit", function () {

    pending();

    describe('initial value check', function () {
        it('isQueuingOperations is false', function () {
            expect(myStore.isQueuingOperations).toEqual(false)
        })
        it('pendingOperationQueue is empty array', function () {
            expect(myStore.pendingOperationQueue).toEqual([])
        })
    })

    describe('add operation sequence', function () {

        let spy_beginReduceOpertions: jasmine.Spy;
        let spy_stateWillAddOperation: jasmine.Spy;
        let itIndex = 0;

        beforeAll(function () {
            spy_beginReduceOpertions = spyOn(myStore, 'beginReduceOpertions').and.callThrough();
            spy_stateWillAddOperation = spyOn(myStore, 'stateWillAddOperation').and.callThrough();
        })

        describe('add operations one by one', function () {

            let expectedOperation: any;

            afterEach(function () {
                expect(spy_stateWillAddOperation.calls.count()).toEqual(itIndex + 1);
                expect(spy_stateWillAddOperation.calls.mostRecent()).toEqual({
                    args: [expectedOperation],
                    object: myStore,
                    returnValue: true
                })
                expect(myStore.pendingOperationQueue.length).toEqual(itIndex + 1);
                expect(myStore.pendingOperationQueue[itIndex]).toEqual(expectedOperation);
                itIndex++
            })

            it('SET operation', async function () {
                myStore.set(myStore.state.age, 11);
                expectedOperation = {
                    operation: 'set',
                    path: '.age',
                    payload: 11
                }
            })

            it('SETNEW operation', async function () {
                myStore.setNew('.age', 14);
                expectedOperation = {
                    operation: 'set',
                    path: '.age',
                    payload: 14
                }
            })

            it('MERGE operation', async function () {
                myStore.merge(myStore.state, {
                    age: 12
                });
                expectedOperation = {
                    operation: 'merge',
                    path: '',
                    payload: {
                        age: 12
                    }
                }
            })

            it('UPDATE operation', async function () {
                let updater = (age: number) => age + 1;
                myStore.update(myStore.state.age, updater);
                expectedOperation = {
                    operation: 'update',
                    path: '.age',
                    payload: updater
                }
            })

            it('setup operation with description', async function () {
                myStore.set(myStore.state.age, 14, 'I am description');
                expectedOperation = {
                    operation: 'set',
                    path: '.age',
                    payload: 14,
                    description: 'I am description'
                }
            })

            it('setup an operation marker', async function () {
                myStore.setOperationMarker('I am marker');
                expectedOperation = {
                    operation: 'mark',
                    description: 'I am marker'
                }
            })

        })

        describe('reduce operations at once', function(){

            it('async invoke beginReduceOpertions', async function(){
                expect(spy_beginReduceOpertions.calls.count()).toEqual(0);
                await delay(0);
                expect(spy_beginReduceOpertions.calls.count()).toEqual(1);
            })

        })

    })


})

describe('Test: Store.getValueByPath', function(){

    pending()

    it('root', function(){
        expect(XStore.getValueByPath(myStore.state, [])).toBe(myStore.state)
    })

    it('root prop', function(){
        expect(XStore.getValueByPath(myStore.state, ['name'])).toBe(myStore.state.name)
    })

    it('array prop', function(){
        expect(XStore.getValueByPath(myStore.state, ['pets'])).toBe(myStore.state.pets)
        expect(XStore.getValueByPath(myStore.state, ['pets', '0'])).toBe(myStore.state.pets[0])
    })

    it('nested prop', function(){
        expect(XStore.getValueByPath(myStore.state, ['pets', '0', 'name'])).toBe(myStore.state.pets[0].name)
    })

})

describe('Test: Store.updateReferenceInPath', function (){

    myStore.preState = myStore.state;
    Object.freeze(myStore.preState);
    Object.freeze(myStore.preState.address);
    Object.freeze(myStore.preState.address.homeInfo);
    Object.freeze(myStore.preState.address.homeInfo.isRend);
    
    myStore.updateReferenceInPath(['address', 'homeInfo'])

    describe('update reference in path', function(){
        it('reference did updated', function(){
            expect(myStore.state).not.toBe(myStore.preState);
            expect(myStore.state.address).not.toBe(myStore.preState.address);
            expect(myStore.state.address.homeInfo).not.toBe(myStore.preState.address.homeInfo);
        })
        it('keep value and __path__ in path', function(){
            expect(myStore.state).toEqual(myStore.preState);

            expect((myStore.state as XType).__xpath__)
                .toEqual((myStore.preState as XType).__xpath__);
            expect((myStore.state.address as XType).__xpath__)
                .toEqual((myStore.preState.address as XType).__xpath__);
            expect((myStore.state.address.homeInfo as XType).__xpath__)
                .toEqual((myStore.preState.address.homeInfo as XType).__xpath__);
        })
    })

    describe('keep reference out of path', function(){
        it('keep reference out of path: brother path', function(){
            expect(myStore.state.pets).toBe(myStore.preState.pets)
        })

        it('keep reference out of path: child path', function(){
            expect(myStore.state.address.homeInfo.isRend).toBe(myStore.preState.address.homeInfo.isRend)
        })
    })

})