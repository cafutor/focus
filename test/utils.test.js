import * as utils from '../src/utils';
const WITHP_ROPERTY_OBJ={
    __proto__:{
        name:'huangtao',
        info:'from hubei',
    },
};

const EMPTY_OBJ={};

describe('test focus utils',()=>{
    test('uitils.isObjectEmpty',()=>{
        expect(utils.isObjEmpty(WITHP_ROPERTY_OBJ)).toBe(false);
        expect(utils.isObjEmpty(EMPTY_OBJ)).toBe(true);
    });
});