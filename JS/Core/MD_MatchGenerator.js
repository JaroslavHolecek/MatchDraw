const { ArrayTwodim, combination } = require('./MD_Algorithms');

/**
 * Generate matches so that every combination of competitors is included 
 * @param {Array} individuals - Array of individuals that will compete in matches 
 * @param {Integer} num default 2 - number of competitors in one match 
 * @returns {Array[Array]} - Array of individual matches that are Array of competitor
 */
function every2every(individuals, num = 2){
    let ids = combination(individuals.length, num);
    let matches = ArrayTwodim(ids.length, num);
    for (let j = 0; j < num; j++) {
        for (let i = 0; i < ids.length; i++) {     
            matches[i][j] = individuals[ids[i][j]];            
        }        
    }
    return matches;
}


function one4each(ids, weights, num = 2){
    

}

module.exports = {every2every};