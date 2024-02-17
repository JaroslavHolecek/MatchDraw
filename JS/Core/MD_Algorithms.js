const { NotSupportedAttributeValue } = require('./MD_Errors');

function ArrayTwodim(i, j) {
    return Array.from(Array(i), () => new Array(j));
}

function combinations(n, k = 2) {
    const all_combinations = [];

    // Initialize the combination with the first K elements
    const currentCombination = [];
    for (let i = 0; i < k; i++) {
        currentCombination.push(i + 1);
    }
    all_combinations.push([...currentCombination]);

    // Generate next combinations until exhausted
    while (true) {
        let i = k - 1;
        // Find the rightmost element that can be incremented
        while (i >= 0 && currentCombination[i] === n - k + i + 1) {
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

/* https://en.wikipedia.org/wiki/Maximum_weight_matching */
function maxWeightMatching(edges){
    const { blossom } = require('./Retrieved/EdmondsBlossom.js');
    const result = blossom(edges, true);
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

module.exports = { ArrayTwodim, combinations, maxWeightMatching };
