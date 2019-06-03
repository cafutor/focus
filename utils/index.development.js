/***
 * 
 * check if the give obj is empty or not
 * 
 * */ 
export const isObjEmpty=(obj)=>{
    if(!obj||Object.prototype.toString.call(obj)!=='[object Object]')
        throw new TypeError('the give value is not a pure object');
    for(let i in obj){
       return false;
    };
    return true;
};
export default {};