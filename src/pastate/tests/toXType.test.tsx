import { XStore, XType, XString } from '../pastore';

// TODO: 把测试对象的属性名改为 “数据结构名”， 使含义更明确

// it 的描述同意改成三部曲：has correct root xpath, has correct prop xpath, has correct prop value

// 用标准值 number: 1 , 2  ; string: string1, string2

interface SimpleState extends XType {
    name: string,
    age: number,
    isMale: boolean,
    isFemale: boolean,
    homeInfo: {
        city: string,
        NO: number,
        isRent: boolean,
        applianceInfo: {
            count: number,
            brand: string,
            isRent: boolean
        }
    },
    numberStringProp: {
        [key: string]: any
    },
    creditCardInfo: {
        isValids: Array<boolean>,
        limits: Array<number>,
        name: Array<string>,
    },
    pets: Array<{
        name: string,
        age: number,
        isCat: boolean
    }>,
    twoDimensionalArray: Array<Array<string>>
}

const initState: SimpleState = {
    name: 'Peter',
    age: 24,
    isMale: true,
    isFemale: false,
    homeInfo: {
        city: 'Guangzhou',
        NO: 12,
        isRent: false,
        applianceInfo: {
            count: 12,
            brand: 'Gree',
            isRent: false
        }
    },
    numberStringProp: {
        '0001': 'test'
    },
    creditCardInfo: {
        isValids: [true, false],
        limits: [10000, 20000],
        name: ['Card1', 'Card2'],
    },
    pets: [{
        name: 'Kitty',
        age: 1,
        isCat: true
    }, {
        name: 'Puppy',
        age: 2,
        isCat: false
    }],
    twoDimensionalArray: [
        ['a00', 'a01'],
        ['a10', 'a11']
    ]
}

class SimpleStore extends XStore<SimpleState>{

}

describe('toXType function test suit', function () {

    let myStore = new SimpleStore(initState);

    describe('can transform basic type at root', function () {

        it('can transform initState into state', function () {
            expect(myStore.imState.__xpath__).toBe('');
            expect(myStore.imState.__store__).toBe(myStore);
        })

        describe('can transform boolean correctly', function () {

            describe('can transform boolean->true correctly', function () {
                it('transform boolean: has the same primitive value', function () {
                    expect(myStore.imState.isMale).toEqual(true)
                })

                it('transform boolean: has the correct __xpath__ value', function () {
                    expect((myStore.imState.isMale as XType).__xpath__).toEqual('.isMale')
                })

                it('transform boolean: has the correct __store__ value', function () {
                    expect((myStore.imState.isMale as XType).__store__).toBe(myStore)
                })
            })

            describe('can transform boolean->false correctly', function () {
                it('transform boolean: has the same primitive value', function () {
                    expect(myStore.imState.isFemale).toEqual(false)
                })

                it('transform boolean: has the correct __xpath__ value', function () {
                    expect((myStore.imState.isFemale as XType).__xpath__).toEqual('.isFemale')
                })

                it('transform boolean: has the correct __store__ value', function () {
                    expect((myStore.imState.isFemale as XType).__store__).toBe(myStore)
                })
            })
        })

        describe('can transform number correctly', function () {

            it('transform number: has the same primitive value', function () {
                expect(myStore.imState.age).toEqual(24)
            })

            it('transform number: has the correct __xpath__ value', function () {
                expect((myStore.imState.age as XType).__xpath__).toEqual('.age')
            })

            it('transform number: has the correct __store__ value', function () {
                expect((myStore.imState.age as XType).__store__).toBe(myStore)
            })
        })

        describe('can transform string correctly', function () {

            it('transform string: has the same primitive value', function () {
                expect(myStore.imState.name).toEqual('Peter')
            })

            it('transform string: has the correct __xpath__ value', function () {
                expect((myStore.imState.name as XType).__xpath__).toEqual('.name')
            })

            it('transform string: has the correct __store__ value', function () {
                expect((myStore.imState.name as XType).__store__).toBe(myStore)
            })
        })
    })

    describe('can transform object', function () {

        describe('can transform object at root', function () {

            it('has correct __xpath__', function () {
                expect((myStore.imState.homeInfo as XType).__xpath__).toEqual('.homeInfo')
            })

            it('has correct __store__', function () {
                expect((myStore.imState.homeInfo as XType).__store__).toBe(myStore)
            })

            it('object props have correct primitive value', function () {
                expect(myStore.imState.homeInfo.city).toEqual('Guangzhou')
                expect(myStore.imState.homeInfo.isRent).toEqual(false)
                expect(myStore.imState.homeInfo.NO).toEqual(12)
            })

            it('object props have correct __xpath__ value', function () {
                expect((myStore.imState.homeInfo.city as XType).__xpath__).toEqual('.homeInfo.city')
                expect((myStore.imState.homeInfo.isRent as XType).__xpath__).toEqual('.homeInfo.isRent')
                expect((myStore.imState.homeInfo.NO as XType).__xpath__).toEqual('.homeInfo.NO')
            })

            it('object props have correct __store__ value', function () {
                expect((myStore.imState.homeInfo.city as XType).__store__).toBe(myStore)
                expect((myStore.imState.homeInfo.isRent as XType).__store__).toBe(myStore)
                expect((myStore.imState.homeInfo.NO as XType).__store__).toBe(myStore)
            })

        })

        describe('can transform nested object', function () {

            it('has correct __xpath__', function () {
                expect((myStore.imState.homeInfo.applianceInfo as XType).__xpath__).toEqual('.homeInfo.applianceInfo')
            })

            it('has correct __store__', function () {
                expect((myStore.imState.homeInfo.applianceInfo as XType).__store__).toBe(myStore)
            })

            it('object props have correct primitive value', function () {
                expect(myStore.imState.homeInfo.applianceInfo.isRent).toEqual(false)
                expect(myStore.imState.homeInfo.applianceInfo.count).toEqual(12)
                expect(myStore.imState.homeInfo.applianceInfo.brand).toEqual('Gree')
            })

            it('object props have correct __xpath__ value', function () {
                expect((myStore.imState.homeInfo.applianceInfo.isRent as XType).__xpath__)
                    .toEqual('.homeInfo.applianceInfo.isRent')
                expect((myStore.imState.homeInfo.applianceInfo.count as XType).__xpath__)
                    .toEqual('.homeInfo.applianceInfo.count')
                expect((myStore.imState.homeInfo.applianceInfo.brand as XType).__xpath__)
                    .toEqual('.homeInfo.applianceInfo.brand')
            })

            it('object props have correct __store__ value', function () {
                expect((myStore.imState.homeInfo.applianceInfo.isRent as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.homeInfo.applianceInfo.count as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.homeInfo.applianceInfo.brand as XType).__store__)
                    .toBe(myStore)
            })

        })

        describe('can transform numberStringProp', function () {

            // Note: support but not suggest to use this kind of data structure,
            // please use Array in place of it

            it('has correct root __xpath__', function () {
                expect((myStore.imState.numberStringProp as XType).__xpath__)
                    .toEqual('.numberStringProp')
            })

            it('has correct root __store__', function () {
                expect((myStore.imState.numberStringProp as XType).__store__)
                    .toBe(myStore)
            })

            it('has correct value __xpath__', function () {
                expect((myStore.imState.numberStringProp['0001'] as XType).__xpath__)
                    .toEqual('.numberStringProp.0001')
            })

            it('has correct value __store__', function () {
                expect((myStore.imState.numberStringProp['0001'] as XType).__store__)
                    .toBe(myStore)
            })

            it('has correct primetive value', function () {
                expect(myStore.imState.numberStringProp['0001'])
                    .toEqual('test')
            })
        })

    })

    describe('can transform root array', function () {

        describe('can transform array with basic type elements', function () {

            it('has correct __xpath__', function () {
                expect((myStore.imState.creditCardInfo as XType).__xpath__)
                    .toEqual('.creditCardInfo')
            })

            it('has correct __store__', function () {
                expect((myStore.imState.creditCardInfo as XType).__store__)
                    .toBe(myStore)
            })

            describe('boolean elements', function () {

                it('has correct __xpath__', function () {
                    expect((myStore.imState.creditCardInfo.isValids as XType).__xpath__)
                        .toEqual('.creditCardInfo.isValids')
                })

                it('has correct __store__', function () {
                    expect((myStore.imState.creditCardInfo.isValids as XType).__store__)
                        .toBe(myStore)
                })

                it('array elements have correct __xpath__ value', function () {
                    expect((myStore.imState.creditCardInfo.isValids[0] as XType).__xpath__)
                        .toEqual('.creditCardInfo.isValids.0')
                    expect((myStore.imState.creditCardInfo.isValids[1] as XType).__xpath__)
                        .toEqual('.creditCardInfo.isValids.1')
                })

                it('array elements have correct __store__ value', function () {
                    expect((myStore.imState.creditCardInfo.isValids[0] as XType).__store__)
                        .toBe(myStore)
                    expect((myStore.imState.creditCardInfo.isValids[1] as XType).__store__)
                        .toBe(myStore)
                })

                it('array elements have correct primitive value', function () {
                    expect(myStore.imState.creditCardInfo.isValids[0])
                        .toEqual(true)
                    expect(myStore.imState.creditCardInfo.isValids[1])
                        .toEqual(false)
                })
            })

            describe('number elements', function () {

                it('has correct __xpath__', function () {
                    expect((myStore.imState.creditCardInfo.limits as XType).__xpath__)
                        .toEqual('.creditCardInfo.limits')
                })

                it('has correct __store__', function () {
                    expect((myStore.imState.creditCardInfo.limits as XType).__store__)
                        .toBe(myStore)
                })

                it('array elements have correct __xpath__ value', function () {
                    expect((myStore.imState.creditCardInfo.limits[0] as XType).__xpath__)
                        .toEqual('.creditCardInfo.limits.0')
                    expect((myStore.imState.creditCardInfo.limits[1] as XType).__xpath__)
                        .toEqual('.creditCardInfo.limits.1')
                })

                it('array elements have correct __store__ value', function () {
                    expect((myStore.imState.creditCardInfo.limits[0] as XType).__store__)
                        .toBe(myStore)
                    expect((myStore.imState.creditCardInfo.limits[1] as XType).__store__)
                        .toBe(myStore)
                })

                it('array elements have correct primitive value', function () {
                    expect(myStore.imState.creditCardInfo.limits[0])
                        .toEqual(10000)
                    expect(myStore.imState.creditCardInfo.limits[1])
                        .toEqual(20000)
                })
            })

            describe('string elements', function () {

                it('has correct __xpath__', function () {
                    expect((myStore.imState.creditCardInfo.name as XType).__xpath__)
                        .toEqual('.creditCardInfo.name')
                })

                it('has correct __store__', function () {
                    expect((myStore.imState.creditCardInfo.name as XType).__store__)
                        .toBe(myStore)
                })

                it('array elements have correct __xpath__ value', function () {
                    expect((myStore.imState.creditCardInfo.name[0] as XType).__xpath__)
                        .toEqual('.creditCardInfo.name.0')
                    expect((myStore.imState.creditCardInfo.name[1] as XType).__xpath__)
                        .toEqual('.creditCardInfo.name.1')
                })

                it('array elements have correct __store__ value', function () {
                    expect((myStore.imState.creditCardInfo.name[0] as XType).__store__)
                        .toBe(myStore)
                    expect((myStore.imState.creditCardInfo.name[1] as XType).__store__)
                        .toBe(myStore)
                })

                it('array elements have correct primitive value', function () {
                    expect(myStore.imState.creditCardInfo.name[0])
                        .toEqual('Card1')
                    expect(myStore.imState.creditCardInfo.name[1])
                        .toEqual('Card2')
                })
            })

        })

        describe('can transform array with object elements', function () {

            it('has correct __xpath__', function () {
                expect((myStore.imState.pets as XType).__xpath__)
                    .toEqual('.pets')
            })

            it('has correct __store__', function () {
                expect((myStore.imState.pets as XType).__store__)
                    .toBe(myStore)
            })

            it('obejct has correct __xpath__ value', function () {
                expect((myStore.imState.pets[0] as XType).__xpath__)
                    .toEqual('.pets.0')
                expect((myStore.imState.pets[1] as XType).__xpath__)
                    .toEqual('.pets.1')
            })

            it('obejct has correct __store__ value', function () {
                expect((myStore.imState.pets[0] as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.pets[1] as XType).__store__)
                    .toBe(myStore)
            })

            describe('object`s boolean prop', function () {

                it('object` props has correct __xpath__ value', function () {
                    expect((myStore.imState.pets[0].isCat as XType).__xpath__)
                        .toEqual('.pets.0.isCat')
                    expect((myStore.imState.pets[1].isCat as XType).__xpath__)
                        .toEqual('.pets.1.isCat')
                })

                it('object` props has correct __store__ value', function () {
                    expect((myStore.imState.pets[0].isCat as XType).__store__)
                        .toBe(myStore)
                    expect((myStore.imState.pets[1].isCat as XType).__store__)
                        .toBe(myStore)
                })

                it('object` props has correct primetive value', function () {
                    expect(myStore.imState.pets[0].isCat)
                        .toEqual(true)
                    expect(myStore.imState.pets[1].isCat)
                        .toEqual(false)
                })

            })

            describe('object`s number prop', function () {

                it('object` props has correct __xpath__ value', function () {
                    expect((myStore.imState.pets[0].age as XType).__xpath__)
                        .toEqual('.pets.0.age')
                    expect((myStore.imState.pets[1].age as XType).__xpath__)
                        .toEqual('.pets.1.age')
                })

                it('object` props has correct __store__ value', function () {
                    expect((myStore.imState.pets[0].age as XType).__store__)
                        .toBe(myStore)
                    expect((myStore.imState.pets[1].age as XType).__store__)
                        .toBe(myStore)
                })

                it('object` props has correct primetive value', function () {
                    expect(myStore.imState.pets[0].age)
                        .toEqual(1)
                    expect(myStore.imState.pets[1].age)
                        .toEqual(2)
                })

            })

            describe('object`s string prop', function () {

                it('object` props has correct __xpath__ value', function () {
                    expect((myStore.imState.pets[0].name as XType).__xpath__)
                        .toEqual('.pets.0.name')
                    expect((myStore.imState.pets[1].name as XType).__xpath__)
                        .toEqual('.pets.1.name')
                })

                it('object` props has correct __store__ value', function () {
                    expect((myStore.imState.pets[0].name as XType).__store__)
                        .toBe(myStore)
                    expect((myStore.imState.pets[1].name as XType).__store__)
                        .toBe(myStore)
                })

                it('object` props has correct primetive value', function () {
                    expect(myStore.imState.pets[0].name)
                        .toEqual('Kitty')
                    expect(myStore.imState.pets[1].name)
                        .toEqual('Puppy')
                })

            })



        })

        describe('can transform array with array elements (multidimensional array)', function () {

            it('has correct root __xpath__', function () {
                expect((myStore.imState.twoDimensionalArray as XType).__xpath__)
                    .toEqual('.twoDimensionalArray')
            })

            it('has correct root __store__', function () {
                expect((myStore.imState.twoDimensionalArray as XType).__store__)
                    .toBe(myStore)
            })

            it('has correct prop __xpath__, 1st dime', function () {
                expect((myStore.imState.twoDimensionalArray[0] as XType).__xpath__)
                    .toEqual('.twoDimensionalArray.0')
                expect((myStore.imState.twoDimensionalArray[1] as XType).__xpath__)
                    .toEqual('.twoDimensionalArray.1')
            })

            it('has correct prop __store__, 1st dime', function () {
                expect((myStore.imState.twoDimensionalArray[0] as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.twoDimensionalArray[1] as XType).__store__)
                    .toBe(myStore)
            })

            it('has correct prop __xpath__, 2nd dime', function () {
                expect((myStore.imState.twoDimensionalArray[0][0] as XType).__xpath__)
                    .toEqual('.twoDimensionalArray.0.0')
                expect((myStore.imState.twoDimensionalArray[0][1] as XType).__xpath__)
                    .toEqual('.twoDimensionalArray.0.1')
                expect((myStore.imState.twoDimensionalArray[1][0] as XType).__xpath__)
                    .toEqual('.twoDimensionalArray.1.0')
                expect((myStore.imState.twoDimensionalArray[1][1] as XType).__xpath__)
                    .toEqual('.twoDimensionalArray.1.1')
            })

            it('has correct prop __store__, 2nd dime', function () {
                expect((myStore.imState.twoDimensionalArray[0][0] as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.twoDimensionalArray[0][1] as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.twoDimensionalArray[1][0] as XType).__store__)
                    .toBe(myStore)
                expect((myStore.imState.twoDimensionalArray[1][1] as XType).__store__)
                    .toBe(myStore)
            })

            it('has correct prop value', function () {
                expect(myStore.imState.twoDimensionalArray[0][0]).toEqual('a00')
                expect(myStore.imState.twoDimensionalArray[0][1]).toEqual('a01')
                expect(myStore.imState.twoDimensionalArray[1][0]).toEqual('a10')
                expect(myStore.imState.twoDimensionalArray[1][1]).toEqual('a11')
            })
        })

    })

})