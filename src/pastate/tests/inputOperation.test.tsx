/**
 * 测试添加 operation 的逻辑
 * - this.set
 * - this.merge
 * - this.update
 * - this.submitOperation
 */

import { XStore, XType, XString } from '../index';
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
                myStore.set(myStore.imState.age, 11);
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
                myStore.merge(myStore.imState, {
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
                myStore.update(myStore.imState.age, updater);
                expectedOperation = {
                    operation: 'update',
                    path: '.age',
                    payload: updater
                }
            })

            it('setup operation with description', async function () {
                myStore.set(myStore.imState.age, 14, 'I am description');
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

