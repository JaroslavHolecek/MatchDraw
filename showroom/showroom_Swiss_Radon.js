const {
    Participant_Radon,
    Match_Radon,
    Tournament_Swiss_Radon,    
} = require('../src/Competition_Custom/Swiss_Radon');

const {
    showListOfObjects
} = require('../src/Core/MD_Helpers');

/* Prepare tournament */
let showroomTournament = new Tournament_Swiss_Radon({
    md_id: 1,
    md_name: "Showroom Swiss Radon Tournament",
    date: new Date("2024-03-17"),
    in_year_number: 1
});
[
    new Participant_Radon({md_id:1, md_name:"Adam", club:"Kladno", birth:new Date("2010")}),
    new Participant_Radon({md_id:2, md_name:"Bára", club:"Kladno", birth:new Date("2010")}),
    new Participant_Radon({md_id:3, md_name:"Cyril", club:"Praha", birth:new Date("2010")}),
    new Participant_Radon({md_id:4, md_name:"David", club:"Praha", birth:new Date("2010")}),
    new Participant_Radon({md_id:5, md_name:"Eliška", club:"Kladno", birth:new Date("2010")}),
    new Participant_Radon({md_id:6, md_name:"Franta", club:"Praha", birth:new Date("2010")}),
    new Participant_Radon({md_id:7, md_name:"Gábina", club:"Kladno", birth:new Date("2010")}),
    new Participant_Radon({md_id:8, md_name:"Honza", club:"Praha", birth:new Date("2010")}),
    new Participant_Radon({md_id:9, md_name:"Iveta", club:"Kladno", birth:new Date("2010")})
].forEach(prtcpnt => showroomTournament.addParticipant(prtcpnt));

let overall_singletons = [];
let match = null;

/* Draw first round */
let {draw_singletons, draw_matches } = showroomTournament.draw();
showroomTournament.arrangeMatches();

/* Show first round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (1. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of first round matches */
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[15,1], [15,2]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[3,15], [15,4]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[5,15], [15,6]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[7,15], [15,8]]);
showroomTournament.add_matchToResults(match);

/* Draw second round */
({draw_singletons, draw_matches } = showroomTournament.draw());
showroomTournament.arrangeMatches();

/* Show second round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (2. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of second round matches */
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch( match, [[15,5], [6,15]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[7,15], [8,15]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[15,9], [10,15]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[11,15], [12,15]]);
showroomTournament.add_matchToResults(match);

/* Draw third round */
({draw_singletons, draw_matches } = showroomTournament.draw());
showroomTournament.arrangeMatches();

/* Show third round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (3. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of third round matches */
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[15,1], [15,2]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[3,15], [15,4]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[5,15], [15,6]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[15,7], [15,8]]);
showroomTournament.add_matchToResults(match);

/* Draw fourth round */
({draw_singletons, draw_matches } = showroomTournament.draw());
showroomTournament.arrangeMatches();

/* Show fourth round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (4. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of fourth round matches */
match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[15,1], [15,2]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[3,15], [15,4]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[5,15], [15,6]]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
showroomTournament.setScoreValuesOfMatch(match, [[15,7], [15,8]]);
showroomTournament.add_matchToResults(match);

showroomTournament.sortResults();
showroomTournament.showCountedOrder();

console.log("====== RESTORED FROM JSON =======");


let trnmntJSON = JSON.stringify(showroomTournament.toJSON());
console.log(trnmntJSON);

let restoredTrnmnt = Tournament_Swiss_Radon.fromJSON(JSON.parse(trnmntJSON));
showroomTournament.showCountedOrder();

/* Draw fifth round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw());
restoredTrnmnt.arrangeMatches();

/* Show fifth round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Matches (5. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of fifth round matches */
match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[5,15], [15,6]]);
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[7,15], [15,8]]);
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[9,15], [15,10]]);
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[11,15], [15,12]]);
restoredTrnmnt.add_matchToResults(match);

/* Draw sixth round */
restoredTrnmnt.sortResults();
({draw_singletons, draw_matches } = restoredTrnmnt.draw());
restoredTrnmnt.arrangeMatches();

/* Show sixth round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Matches (6. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of sixth round matches */
match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[5,15], [15,6]]);
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[7,15], [15,8]]);
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[9,15], [15,10]]);
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
restoredTrnmnt.setScoreValuesOfMatch( match, [[11,15], [15,12]]);
restoredTrnmnt.add_matchToResults(match);

/* Draw restored compensatory round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw());
restoredTrnmnt.arrangeMatches();

/* Show restored compensatory round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Matches (compensatory round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of restored compensatory round matches */
match = restoredTrnmnt.getNextUnplayedMatch();
if(match){
    restoredTrnmnt.setScoreValuesOfMatch(match, [[1,15], [1,15]]);
    restoredTrnmnt.add_matchToResults(match);
}
match = restoredTrnmnt.getNextUnplayedMatch();
if(match){
    match = restoredTrnmnt.getNextUnplayedMatch();
    restoredTrnmnt.setScoreValuesOfMatch(match, [[15,1], [15,2]]);
    restoredTrnmnt.add_matchToResults(match);
}
match = restoredTrnmnt.getNextUnplayedMatch();
if(match){
    match = restoredTrnmnt.getNextUnplayedMatch();
    restoredTrnmnt.setScoreValuesOfMatch(match, [[3,15], [15,4]]);
    restoredTrnmnt.add_matchToResults(match);
}

/* Sort and show result of restored tournament */
restoredTrnmnt.sortResults();
restoredTrnmnt.showCountedOrder();

console.log(`Overall number of matches : ${restoredTrnmnt.md_matches.length}`);


