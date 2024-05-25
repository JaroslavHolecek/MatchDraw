const { NotMatchArguments } = require('./MD_Errors');

/**
 * Generate two-dimensional array 
 * @param {int} i - first (outter) dimension
 * @param {int} j - secon (inner) dimension 
 * @returns Array[ i*Array[j] ]
 */
function ArrayTwodim(i, j) {
    return Array.from(Array(i), () => new Array(j));
}

function SetRange(max){
    let all =  new Set();
    for (let index = 0; index < max; index++) {
        all.add(index);        
    }
    return all;
}



function selectOneDimFromListByIds(list, ids){
    let outter = ids.length;
    let list_length = list.length;
    let selected = Array(outter);
    let id;
    for (let i = 0; i < outter; i++) {
        id = ids[i];
        if (id >= list_length || id < 0) {
            throw new NotMatchArguments("list", list, "ids", ids, `value ${id} is out of range`);
        }     
        selected[i] = list[id];            
    }   
    return selected;
}

function selectTwoDimFromListByIds(list, ids){
    let outter = ids.length;
    let inner = outter > 0 ? ids[0].length : 0;
    let list_length = list.length;
    let selected = ArrayTwodim(outter, inner);
    for (let j = 0; j < inner; j++) {
        for (let i = 0; i < outter; i++) {    
            id = ids[i][j];
            if (id >= list_length || id < 0) {
                throw new NotMatchArguments("list", list, "ids", ids, `value ${id} is out of range`);
            } 
            selected[i][j] = list[id];            
        }        
    }
    return selected;
}

function indexesOfMaxInArray(array){
    let indexes = [];

    if (array.length == 0){
        return indexes;
    }

    let actual_max = array[0];
    
    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if(element < actual_max){
            continue;
        }

        if(element === actual_max){
            indexes.push(index);
            continue; 
        }
        
        /* higher than actual_max */
        indexes = [];
        indexes.push(index);
        actual_max = element;
        
    }
    return indexes;
}

function maxOfArray(array){
    return array.reduce((a, b) => Math.max(a, b), -Infinity);
}

function minOfArray(array){
    return array.reduce((a, b) => Math.min(a, b), Infinity);
}

function showListOfObjects(message="", obj_list=[]){
    console.log(message)
    obj_list.forEach(obj => {
        console.log(`\t${obj.toString()}`);
    });
}

function sumArray(array){
    return array.reduce((partialSum, a) => partialSum + a, 0);
}

function appendToArray(to, from){
    if (to.length != from.length){
        throw NotMatchArguments("to.length", to.length, "from.length", from.length);
    }
    for (let index = 0; index < from.length; index++) {
        to[index] += from[index];        
    }
}

/**
 * 
 * @param {Array[Array]} arrays 2D array of sumable primitives 
 * @returns {Array} Element-wise sum
 */
function sumAllArrays(arrays){
    if (arrays.length < 1){
        return [];
    }
    let res = Array(arrays[0].length).fill(0);
    arrays.forEach(arr => appendToArray(res, arr)); 
    return res;
}

function markMaxAndOtherInArray(array, arg_obj={max_mark:1, other_mark:-1}){
    let max_indexes = indexesOfMaxInArray(array);
    let res = Array(array.length).fill(arg_obj.other_mark);
    max_indexes.forEach(idx => res[idx] = arg_obj.max_mark);
    return res;
}

function shortStringDate(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = {
    ArrayTwodim,
    SetRange,
    selectOneDimFromListByIds,
    selectTwoDimFromListByIds,
    indexesOfMaxInArray,
    maxOfArray,
    minOfArray,
    showListOfObjects,
    sumArray,
    appendToArray,
    sumAllArrays,
    markMaxAndOtherInArray,
    shortStringDate
};