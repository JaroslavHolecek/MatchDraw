const { combinations } = require('./MD_Algorithms');
const { NotSupportedAttributeValue, NotMatchArguments } = require('./MD_Errors');

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

const POLICY_EDMOND_WEIGHTS = {
    E2E_EQUAL: 0, /* Every to every, each edge has same weights === 1 */
    E2E_SORTED_LINEAR: 1, /* Every to every, weight is linear inverse of distance between indexes (max_distance - distance + 1) */
    E2E_SORTED_FRACTIONAL_LINEAR: 2, /* Every to every, weight is linear fraction of distance between indexes (1 / distance) */
  };

/**
 * Simple generator of weights/edges for one4each() function. Probably you will change some of values by your intention after usage of this function
 * @param {Int} num_individuals number of individuals (number of indexes for wich will be weights generated) 
 * @param {POLICY_EDMOND_WEIGHTS} policy policy for generating weights, see POLICY_EDMOND_WEIGHTS for description
 * @returns Array[NumberArray[3]] Array of edges in format [node_from, node_to, weight], node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes
*/
function weightsGenerator_Edmonds(num_individuals, policy){
    let edges = [];

    switch (policy) {
        case POLICY_EDMOND_WEIGHTS.E2E_EQUAL:
            let comb_equal = combinations(num_individuals, 2);
            comb_equal.forEach(nodes => {
                edges.push([...nodes, 1]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR:
            let comb_sl = combinations(num_individuals, 2);
            comb_sl.forEach(nodes => {
                edges.push([...nodes, num_individuals - Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_FRACTIONAL_LINEAR:
            let comb_fl = combinations(num_individuals, 2);
            comb_fl.forEach(nodes => {
                edges.push([...nodes, 1/Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        default:
          throw new NotSupportedAttributeValue("policy", policy, "use policy from POLICY_EDMOND_WEIGHTS")
    }
    return edges;

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
    let inner = ids[0].length
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

module.exports = {
    ArrayTwodim,
    SetRange,
    POLICY_EDMOND_WEIGHTS,
    weightsGenerator_Edmonds,
    selectOneDimFromListByIds,
    selectTwoDimFromListByIds,
    indexesOfMaxInArray,
};