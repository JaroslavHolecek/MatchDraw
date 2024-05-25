const {
    MD_Competition   
} = require('../src/Competition/MD_Competition');
const {
    MD_Participant
} = require('../src/Competition/MD_Participant');

let showroomTournament = new MD_Competition(
    {
        md_id:1,
        md_name:"Showroom Tournament"
    }
);
[
    new MD_Participant({md_id:1, md_name:"Adam"}),
    new MD_Participant({md_id:2, md_name:"Bára"}),
    new MD_Participant({md_id:3, md_name:"Cyril"}),
    new MD_Participant({md_id:4, md_name:"David"}),
    new MD_Participant({md_id:5, md_name:"Eliška"})
].forEach(prtcpnt => showroomTournament.addParticipant(prtcpnt));

showroomTournament.draw();
showroomTournament.arrangeMatches();

let match = showroomTournament.getNextUnplayedMatch();
console.log(match.toString());

/* match.md_score = {values: [3,5]}; // alternatively */
/* showroomTournament.setScoreValuesOfMatch(match, [3,5]);  // alternatively */
showroomTournament.setScoreValuesOfMatch(match.md_id, [1,1]);
console.log(match.toString());
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
console.log(match.toString());
match.md_score = {md_values:[2,1]};
console.log(match.toString());
showroomTournament.add_matchToResults(match);

/* ... etc */
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [3,1]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [4,1]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [1,2]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [2,2]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [3,2]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [1,3]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [2,3]);
showroomTournament.add_matchToResults(match);
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match.md_id, [1,4]);
showroomTournament.add_matchToResults(match);
    
showroomTournament.sortResults();
showroomTournament.showCountedOrder();

/* or compute all results at once - for example when one result depends on other... */
showroomTournament.recount_allResults();

showroomTournament.sortResults();
showroomTournament.showCountedOrder();
