const {
    Participant_Elo_Radon,
    Tournament_Elo_Radon   
} = require('../src/Competition_Custom/Elo_Radon');

const {
    MD_Club
} = require('../src/Competition/MD_Club');

const {
    showListOfObjects
} = require('../src/Core/MD_Helpers');

/* Prepare tournament */
let showroomTournament = new Tournament_Elo_Radon({
    id: 1,
    name: "Showroom Elo Radon Tournament",
    date: new Date("2024-03-17"),
    in_year_number: 1
});
[
    new MD_Club({id:1, name:"Kladno"}),
    new MD_Club({id:2, name:"Praha"}),
    new MD_Club({id:3, name:"Brno"})

].forEach(clb => showroomTournament.addClub(clb));
[
    new Participant_Elo_Radon({id:1, name:"Adam", second_name:"První", club: showroomTournament.clubs[0], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:2, name:"Bára", second_name:"Druhá", club: showroomTournament.clubs[0], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:3, name:"Cyril", second_name:"Třetí", club: showroomTournament.clubs[1], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:4, name:"David", second_name:"Čtvrtý", club: showroomTournament.clubs[1], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:5, name:"Eliška", second_name:"Pátá", club: showroomTournament.clubs[2], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:6, name:"Franta", second_name:"Šestý", club: showroomTournament.clubs[2], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:7, name:"Gábina", second_name:"Sedmá", club: showroomTournament.clubs[0], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:8, name:"Honza", second_name:"Osmý", club: showroomTournament.clubs[1], birth:new Date("2010")}),
    new Participant_Elo_Radon({id:9, name:"Iveta", second_name:"Devátá", club: showroomTournament.clubs[2], birth:new Date("2010")})
].forEach(prtcpnt => showroomTournament.addParticipant(prtcpnt));
showroomTournament.get_participants().forEach(prtcpnt =>
    showroomTournament.addParticipantResult(prtcpnt, {value:500})
);

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

let restoredTrnmnt = Tournament_Elo_Radon.fromJSON(JSON.parse(trnmntJSON));
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

console.log(`Overall number of matches : ${restoredTrnmnt.matches.length}`);

showListOfObjects("Matches all:", restoredTrnmnt.matches);


