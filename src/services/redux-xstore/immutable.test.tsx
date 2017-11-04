import { fromJS } from 'immutable';

describe('basic test', function(){
    pending();

    let rawObj = {
        prop1: {
            abc: 1,
            prop2: {
                a: 1
            }
        },
    }
    let imBackJS = fromJS(rawObj).toJS();

    it('raw preserve reference', function(){
        let rawObjectCopy = rawObj;
        expect(rawObjectCopy).toBe(rawObj);
        expect(rawObjectCopy.prop1).toBe(rawObj.prop1);
        expect(rawObjectCopy.prop1.prop2).toBe(rawObj.prop1.prop2);
    })

    it('immutable preserve reference: root', function(){
        expect(imBackJS).toBe(rawObj);
    })

    it('immutable preserve reference: sub-prop', function(){
        expect(imBackJS.prop1).toBe(rawObj.prop1);
    })

    it('immutable preserve reference: sub-sub-prop', function(){
        expect(imBackJS.prop1.prop2).toBe(rawObj.prop1.prop2);
    })
})


describe('basic test', function(){
    let rawObj = {
        prop1: {
            abc: 1,
            prop2: {
                a: 1
            }
        },
    }
    let imObj = fromJS(rawObj);

    it('set', function(){
        let imObj1 = imObj.setIn(['prop1', 'abc'], 1);
        expect(imObj1).toBe(imObj);
        expect(imObj1.get('prop1')).toBe(imObj.get('prop1'));
        expect(imObj1.get('prop1').get('prop2')).toBe(imObj.get('prop1').get('prop2'));
        
    })

})