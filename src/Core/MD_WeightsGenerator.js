const { combinations } = require('./MD_Algorithms');
const { NotSupportedAttributeValue } = require('./MD_Errors');

/* EdmoondsBlossom looking for MAXIMUM of sum of weights, so greater value of weights is prefered in result over smaller value */
const POLICY_EDMOND_WEIGHTS = {
    E2E_EQUAL: 0, /* Every to every, each edge has same weights === 1 */
    /* Do not account distance of individuals in order */
    E2E_SORTED_LINEAR_INVERSE: 1, /* Every to every, weight is linear inverse of distance between indexes (max_distance - distance + 1) */
    /* 1. vs 4. and 2. vs 3. have same value as 1. vs 3. and 2. vs 4. -> wich is usually not good */
    E2E_SORTED_LINEAR_FRACTIONAL: 2, /* Every to every, weight is linear fraction of distance between indexes (1 / distance) */
    /* Here is hard to artificaly shift order of players for example with same club to greater distance
        Shift is easy, but is irregulary distributed throught higher places of order and lower one
    */
    E2E_SORTED_NEGATIVE_LINEAR_PLUS_FRACTIONAL: 3, /* Every to every, weights are negative -> -(distance + 1/distance) */
    E2E_SORTED_QUADRATIC_INVERSE: 4, /* Every to every, (max_distance+1)**2 - distance**2 */
};

/**
 * Simple generator of weights/edges for one4each() function. Probably you will change some of values by your intention after usage of this function
 * @param {Int} num_individuals number of individuals (number of indexes for wich will be weights generated) 
 * @param {POLICY_EDMOND_WEIGHTS} policy policy for generating weights, see POLICY_EDMOND_WEIGHTS for description
 * @returns Array[NumberArray[3]] Array of edges in format [node_from, node_to, weight], node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes
*/
function weightsGenerator_Edmonds(num_individuals, policy){
    let edges = [];
    if (num_individuals <= 0){return edges;}

    switch (policy) {
        case POLICY_EDMOND_WEIGHTS.E2E_EQUAL:
            let comb_equal = combinations(num_individuals, 2);
            comb_equal.forEach(nodes => {
                edges.push([...nodes, 1]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR_INVERSE:
            let comb_sl = combinations(num_individuals, 2);
            comb_sl.forEach(nodes => {
                edges.push([...nodes, num_individuals - Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR_FRACTIONAL:
            let comb_fl = combinations(num_individuals, 2);
            comb_fl.forEach(nodes => {
                edges.push([...nodes, 1/Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_NEGATIVE_LINEAR_PLUS_FRACTIONAL:
            let comb_nlpf = combinations(num_individuals, 2);
            comb_nlpf.forEach(nodes => {
                edges.push([...nodes, -(Math.abs(nodes[1] - nodes[0]) + 1/Math.abs(nodes[1] - nodes[0]))]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_QUADRATIC_INVERSE:
            let comb_sqi = combinations(num_individuals, 2);
            comb_sqi.forEach(nodes => {
                edges.push([...nodes, num_individuals**2 - (nodes[1] - nodes[0])**2]);
            });
            break;
        default:
          throw new NotSupportedAttributeValue("policy", policy, "use policy from POLICY_EDMOND_WEIGHTS")
    }
    return edges;
}

/**
 * 
 * @param {Array[NumberArray[3]]} weights probably returned from weightsGenerator_Edmonds
 * @param {Array[NumberArray[2]]} to_remove array of edges (Array[2]) with from_index and to_index
 */
function removeEdges(weights, to_remove){
    to_remove.forEach(tr => {
        let edge_index = weights.findIndex(w =>
            tr.includes(w[0]) && tr.includes(w[1]) /* only for two participant now */
            )
        if (edge_index !== -1){ /* match really found */
            weights.splice(edge_index, 1);
        }    
    });
}



module.exports = {
    POLICY_EDMOND_WEIGHTS,
    weightsGenerator_Edmonds,
    removeEdges
};