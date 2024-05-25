const {
    MD_Score_Simple,
    MD_Score_Composite,
} = require('./Competition/MD_Score');
const {
    MD_Result_Points,
    MD_Result_Sets,
    MD_Result_Sets_Points,
} = require('./Competition/MD_Result');
const {
    Participant_Radon,
    Tournament_Swiss_Radon,
} = require('./Competition_Custom/Swiss_Radon');

console.log("See examples in showroom directory for usage example.");

module.exports = {
    RESULT_TEMPLATES,
    Participant_Radon,
    Tournament_Swiss_Radon,
};