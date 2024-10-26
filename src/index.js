// const {
//     MD_Score_Simple,
//     MD_Score_Composite,
// } = require('./Competition/MD_Score');
// const {
//     MD_Result_Points,
//     MD_Result_Sets,
//     MD_Result_Sets_Points,
// } = require('./Competition/MD_Result');
const {
    Participant_Elo_Radon,
    Tournament_Elo_Radon,
} = require('./Competition_Custom/Elo_Radon');
const{
    MD_Club,
} = require('./Competition/MD_Club');

console.log("See examples in showroom directory for usage example.");

module.exports = {
    Participant_Elo_Radon,
    Tournament_Elo_Radon,
    MD_Club,
};