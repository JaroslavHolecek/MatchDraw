const { NotSupportedAttributeValue } = require('./MD_Errors');
const { combinations, maxWeightMatching } = require('./MD_Algorithms');
const {
    selectOneDimFromListByIds,
    selectTwoDimFromListByIds,
    SetRange, } = require('./MD_Helpers');

/**
 * @typedef {Object} DrawResult
 * @property {Array[Array]} matches - Array of matches that are Array of competitors
 * @property {Array} singletons - Competitors not included in any match
 */

/**
 * Generate matches so that every combination of competitors is included 
 * @param {Array} individuals - Array of individuals that will compete in matches 
 * @param {Integer} num default 2 - number of competitors in one match 
 * @returns {DrawResult} - Result of draw
 */
function every2every(individuals, num = 2){
    let ids = combinations(individuals.length, num);
    return {
        matches : selectTwoDimFromListByIds(individuals, ids),
        singletons : [], /* no singletons in every to every */
    };
}

/**
 * Generate matches so that every Individuals occure in max one match. Maximize sum of edges (connections between individuals)
 * @param {Array} individuals - Array of individuals that will compete in matches
 * @param {Array[IntArray[0]]} weights - Array of edges with weights in format [indexOfIndividual_from, indexOfIndividual_to, weight]
 * @param {Int} num - default 2 (2 is only possible now) - number of competitors in one match 
 * @param {Boolean} maximumMatches - if true -> prefer maximum count of matches over maximum sum of edges
 * @returns {DrawResult} - Result of draw
 */
function one4each(individuals, weights, num = 2, maximumMatches=true){
    if(num != 2){ throw new NotSupportedAttributeValue("num", num, "Only 2 competitors in match available at the moment.")    }
    const draw = maxWeightMatching(weights, maximumMatches);
    
    let ids = SetRange(individuals.length);
    draw.matched_edges.forEach(matched_nodes => {
        ids.delete(matched_nodes[0]);
        ids.delete(matched_nodes[1]);
    });
    draw.nonmatched_nodes.forEach(non_matched_node => {
        ids.delete(non_matched_node);
    });

    let nonmached_ids = draw.nonmatched_nodes;
    ids.forEach(not_proccessed_node => {
        nonmached_ids.push(not_proccessed_node);
    });
    nonmached_ids.sort();
    return {
        matches : selectTwoDimFromListByIds(individuals, draw.matched_edges),
        singletons : selectOneDimFromListByIds(individuals, nonmached_ids),
    }

}



module.exports = {every2every, one4each };