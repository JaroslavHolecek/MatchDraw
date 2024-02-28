const { NotSupportedAttributeValue } = require('./MD_Errors');
const { combinations } = require('./MD_Algorithms');
const { selectOneDimFromListByIds, selectTwoDimFromListByIds } = require('./MD_Helpers');

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


function one4each(individuals, weights, num = 2, maximumMatches=true){
    if(num != 2){ throw new NotSupportedAttributeValue("num", num, "Only 2 competitors in match available at the moment.")    }
    const draw = maxWeightMatching(weights, maximumMatches);
    return {
        matches : selectTwoDimFromListByIds(individuals, draw.matched_edges),
        singletons : selectOneDimFromListByIds(individuals, draw.nonmatched_nodes),
    }

}



module.exports = {every2every, one4each };