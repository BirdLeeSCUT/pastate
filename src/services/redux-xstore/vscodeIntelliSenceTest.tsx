
/**
 * 基于泛型的 intellisense 功能
 * @param a 
 * @param b 
 */
function testA<T>(a: T, b: T){}
testA({ abc: '1'}, { abc: '2'})