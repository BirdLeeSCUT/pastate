import { fromJS } from 'immutable';

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