
/**
 * Combinations C(n,k) n choose k
 * @param {int} n 
 * @param {int} k 
 * @returns {Array[Array]}Array of all combinations (Arrays)  
 */
function combinations(n, k = 2) {
    const all_combinations = [];

    // Initialize the combination with the first K elements
    const currentCombination = [];
    for (let i = 0; i < k; i++) {
        currentCombination.push(i);
    }
    all_combinations.push([...currentCombination]);

    // Generate next combinations until exhausted
    while (true) {
        let i = k - 1;
        // Find the rightmost element that can be incremented
        while (i >= 0 && currentCombination[i] === n - k + i) {
            i--;
        }
        if (i === -1) {
            // All combinations have been generated
            break;
        }
        currentCombination[i]++;
        // Update the remaining elements
        for (let j = i + 1; j < k; j++) {
            currentCombination[j] = currentCombination[j - 1] + 1;
        }
        all_combinations.push([...currentCombination]);
    }

    return all_combinations;
}

/**
 * Maximum weight matching https://en.wikipedia.org/wiki/Maximum_weight_matching
 * Currently use Edmonds algorithm.
 * @param {Array[NumberArray[3]]} edges Array of edges in format [node_from, node_to, weight], node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes 
 * @param {Boolean} maximumMatches if True (default), maximum possible count of edges (matches) has prirority over maximum sum of weigts 
 * @returns {Object} object.matched Array[IntArray[2]] list of doubles, indexes of node_from and node_to of selected edges; object.nonmatched IntArray list of non-matched nodes (its indexes)
 * 
 */
function maxWeightMatching(edges, maximumMatches=true){
    const { blossom } = require('./Retrieved/EdmondsBlossom.js');
    const result = blossom(edges, maximumMatches);
    var matched = [];
    var nonmatched = [];
    for (let i_from = 0; i_from < result.length; i_from++) {
        const to = result[i_from];
        if(to === -1){nonmatched.push(i_from);}
        else if (i_from < to){
            matched.push([i_from, to]);
        }
    }

    return {
        matched_edges: matched,
        nonmatched_nodes: nonmatched,
    };

}



module.exports = { combinations, maxWeightMatching };
