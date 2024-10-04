const { resolve_functions } = require('./MD_Resolve_functions');
const { MD_Result_Points } = require('./MD_Result');
const { MD_Score_Simple, MD_Score_Composite } = require('./MD_Score');

MD_Match2Results = {
    simpleScore2points(match){
        let given = resolve_functions.D1.GIVE_VALUES(match.score.values);
        let get = resolve_functions.D1.SUM_GET_VALUES(match.score.values);
        let res = [];
        for (let index = 0; index < given.length; index++) {
            res.push(new MD_Result_Points({given:given[index], get:get[index]}));            
        }
        return res;
    },
}


module.exports = {MD_Match2Results};