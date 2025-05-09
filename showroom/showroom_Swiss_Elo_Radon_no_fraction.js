const {
    Participant_Elo_Radon,
    Tournament_Elo_Radon,   
    Match_Elo_Radon
} = require('../src/Competition_Custom/Elo_Radon');

const {
    MD_Club
} = require('../src/Competition/MD_Club');

const {
    showListOfObjects
} = require('../src/Core/MD_Helpers');

function generateScore_random() {
    const maximum = 15;
    const set1_r = Math.floor(Math.random() * maximum);
    const set2_r = Math.floor(Math.random() * maximum);
    return [
        Math.random() > 0.5 ? [maximum, set1_r] : [set1_r, maximum],
        Math.random() > 0.5 ? [maximum, set2_r] : [set2_r, maximum]
    ];    
}

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

showroomTournament.addForbiddenMatch(
    new Match_Elo_Radon({id:-1, participants:[showroomTournament.get_participant_via_Id(1),
         showroomTournament.get_participant_via_Id(2)]}
        )
    );

let match = null;

/* Draw first round */
let {draw_singletons, draw_matches } = showroomTournament.draw();
showroomTournament.arrangeMatches();

let mtch_tmp = draw_matches;
let sngltn_tmp = draw_singletons;

/* Draw second round */
({draw_singletons, draw_matches} = showroomTournament.draw());
showroomTournament.arrangeMatches();
let draw_matches_prep = draw_matches;
let draw_singletons_prep = draw_singletons;
draw_matches = mtch_tmp;
draw_singletons = sngltn_tmp;

/* Show first round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (1. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of first round matches */
draw_matches.forEach(match => {
    showroomTournament.setScoreValuesOfMatch(match, generateScore_random());
    showroomTournament.add_matchToResults(match);
});
showListOfObjects("Matches (1. round filled):", draw_matches);


/* Draw third round */
mtch_tmp = draw_matches_prep;
sngltn_tmp = draw_singletons_prep;
({draw_singletons, draw_matches } = showroomTournament.draw());
showroomTournament.arrangeMatches();
draw_matches_prep = draw_matches;
draw_singletons_prep = draw_singletons;
draw_matches = mtch_tmp;
draw_singletons = sngltn_tmp;

/* Show second round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (2. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of second round matches */
draw_matches.forEach(match => {
    showroomTournament.setScoreValuesOfMatch(match, generateScore_random());
    showroomTournament.add_matchToResults(match);
});
showListOfObjects("Matches (2. round filled):", draw_matches);

/* Draw fourth round */
mtch_tmp = draw_matches_prep;
sngltn_tmp = draw_singletons_prep;
({draw_singletons, draw_matches } = showroomTournament.draw());
showroomTournament.arrangeMatches();
draw_matches_prep = draw_matches;
draw_singletons_prep = draw_singletons;
draw_matches = mtch_tmp;
draw_singletons = sngltn_tmp;

/* Show third round */
showroomTournament.showCountedOrder();
showListOfObjects("Matches (3. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of third round matches */
draw_matches.forEach(match => {
    showroomTournament.setScoreValuesOfMatch(match, generateScore_random());
    showroomTournament.add_matchToResults(match);
});
showListOfObjects("Matches (3. round filled):", draw_matches);

showroomTournament.addNotDrawPlayer(showroomTournament.get_participant_via_Id(1));
showroomTournament.addNotDrawPlayer(showroomTournament.get_participant_via_Id(2));

/* Fill score of third round matches */
draw_matches_prep.forEach(match => {
    showroomTournament.setScoreValuesOfMatch(match, generateScore_random());
    showroomTournament.add_matchToResults(match);
});
showListOfObjects("Matches (4. round filled):", draw_matches_prep);
showListOfObjects("Participants without match:", draw_singletons_prep);

showroomTournament.sortResults();
showroomTournament.showCountedOrder();

console.log("====== RESTORED FROM JSON =======");

let trnmntJSON = JSON.stringify(showroomTournament.toJSON(), null, 2);
console.log(trnmntJSON);

let restoredTrnmnt = Tournament_Elo_Radon.fromJSON(JSON.parse(trnmntJSON));
restoredTrnmnt.showCountedOrder();

/* Draw fifth round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw());
restoredTrnmnt.arrangeMatches();

/* Draw sixth round */
mtch_tmp = draw_matches_prep;
sngltn_tmp = draw_singletons_prep;
({draw_singletons, draw_matches } = showroomTournament.draw());
showroomTournament.arrangeMatches();
draw_matches_prep = draw_matches;
draw_singletons_prep = draw_singletons;
draw_matches = mtch_tmp;
draw_singletons = sngltn_tmp;

/* Show fifth round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Matches (5. round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Show sixth round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Matches (6. round):", draw_matches_prep);
showListOfObjects("Participants without match:", draw_singletons_prep);

/* Fill score of fifth and sixth round matches */
while(true){
    match = restoredTrnmnt.getNextUnplayedMatch(); 
    if(!match) break;
    restoredTrnmnt.setScoreValuesOfMatch(match, generateScore_random());
    restoredTrnmnt.add_matchToResults(match);
}
showListOfObjects("Matches (5. round filled):", draw_matches);
showListOfObjects("Matches (6. round filled):", draw_matches_prep);

/* Draw restored compensatory round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw());
restoredTrnmnt.arrangeMatches();

/* Show restored compensatory round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Matches (compensatory round):", draw_matches);
showListOfObjects("Participants without match:", draw_singletons);

/* Fill score of restored compensatory round matches */
while(true){
    match = restoredTrnmnt.getNextUnplayedMatch(); 
    if(!match) break;
    restoredTrnmnt.setScoreValuesOfMatch(match, generateScore_random());
    restoredTrnmnt.add_matchToResults(match);
}
showListOfObjects("Matches (compensatory round filled):", draw_matches);

/* Sort and show result of restored tournament */
restoredTrnmnt.sortResults();
restoredTrnmnt.showCountedOrder();

console.log(`Overall number of matches : ${restoredTrnmnt.matches.length}`);

showListOfObjects("Matches all:", restoredTrnmnt.matches);


