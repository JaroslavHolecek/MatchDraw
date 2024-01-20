const { NotSupportedAttributeValue } = require('./MD_Errors');

function ArrayTwodim(i, j){
    return Array.from(Array(i), () => new Array(j));
}

function combination(N, K = 2){
    if (K != 2){
        throw new NotSupportedAttributeValue("K", K, "combination function");
    }

    let number = N*(N-1)/2;
    let comb = ArrayTwodim(number, K);
    let k = 0;
    for (let i = 0; i < N; i++) {
        for (let j = i+1; j < N; j++) {
            comb[k][0] = i;
            comb[k++][1] = j;                
        }            
    }    
    return comb;

}

/* https://en.wikipedia.org/wiki/Maximum_weight_matching */
function pairing(){

}

module.exports = {combination, ArrayTwodim};