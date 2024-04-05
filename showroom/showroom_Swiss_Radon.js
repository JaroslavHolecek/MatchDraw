const {
    Participant_Radon,
    Tournament_Swiss_Radon,    
} = require('../src/Competition/MD_Swiss_Radon');

const {
    showListOfObjects
} = require('../src/Core/MD_Helpers');

/* Prepare tournament */
let showroomTournament = new Tournament_Swiss_Radon(
    1,
    "Showroom Tournament",
    new Date("2024-03-17"),
    0,
    [
        new Participant_Radon(1, "Adam", "Kladno", "2010"),
        new Participant_Radon(2, "Bára", "Kladno", "2010"),
        new Participant_Radon(3, "Cyril", "Praha", "2010"),
        new Participant_Radon(4, "David", "Praha", "2010"),
    ]
);
showroomTournament.addParticipant(new Participant_Radon(5, "Eliška", "Kladno", "2010"));
showroomTournament.addParticipant(new Participant_Radon(6, "Franta", "Praha", "2010"));
showroomTournament.addParticipant(new Participant_Radon(7, "Gábina", "Kladno", "2010"));
showroomTournament.addParticipant(new Participant_Radon(8, "Honza", "Praha", "2010"));
showroomTournament.addParticipant(new Participant_Radon(9, "Iveta", "Kladno", "2010"));

let overall_singletons = [];
let match = null;

/* Draw first round */
let {draw_singletons, draw_matches } = showroomTournament.draw();
showroomTournament.arrangeMatches();
overall_singletons.push(...draw_singletons);

/* Show first round */
showroomTournament.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of first round matches */
match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,1], [15,2]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[3,15], [15,4]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[5,15], [15,6]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,7], [15,8]];
showroomTournament.add_matchToResults(match);

/* Draw second round */
({draw_singletons, draw_matches } = showroomTournament.draw(overall_singletons));
showroomTournament.arrangeMatches();
overall_singletons.push(...draw_singletons);

/* Show second round */
showroomTournament.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of second round matches */
match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,5], [6,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[7,15], [8,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,9], [10,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[11,15], [12,15]];
showroomTournament.add_matchToResults(match);

/* Draw third round */
({draw_singletons, draw_matches } = showroomTournament.draw(overall_singletons));
showroomTournament.arrangeMatches();
overall_singletons.push(...draw_singletons);

/* Show third round */
showroomTournament.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of third round matches */
match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,1], [15,2]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[3,15], [15,4]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[5,15], [15,6]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,7], [15,8]];
showroomTournament.add_matchToResults(match);

/* Draw fourth round */
({draw_singletons, draw_matches } = showroomTournament.draw(overall_singletons, false));
showroomTournament.arrangeMatches();
overall_singletons.push(...draw_singletons);

/* Show fourth round */
showroomTournament.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of fourth round matches */
match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,5], [6,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[7,15], [8,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[15,9], [10,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[11,15], [12,15]];
showroomTournament.add_matchToResults(match);

/* Draw compensatory round */
({draw_singletons, draw_matches } = showroomTournament.draw_compensatory(overall_singletons));
showroomTournament.arrangeMatches();

/* Show compensatory round */
showroomTournament.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of compensatory round matches */
match = showroomTournament.getNextUnplayedMatch();
match.score = [[1,15], [1,15]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
match.score = [[3,15], [4,15]];
showroomTournament.add_matchToResults(match);

/* Sort and show result of tournament */
showroomTournament.sortResults();
showroomTournament.showCountedOrder();

console.log("====== RESTORED FROM JSON =======");
overall_singletons = [];

let trnmntJSON = JSON.stringify(showroomTournament);
console.log(trnmntJSON);

let restoredTrnmnt = Tournament_Swiss_Radon.fromJSON(JSON.parse(trnmntJSON));
// console.log(restoredTrnmnt)

/* Draw fifth round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw(overall_singletons, true));
restoredTrnmnt.arrangeMatches();
overall_singletons.push(...draw_singletons);

/* Show fifth round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of fifth round matches */
match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[15,5], [6,15]];
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[7,15], [8,15]];
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[15,9], [10,15]];
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[11,15], [12,15]];
restoredTrnmnt.add_matchToResults(match);

/* Draw sixth round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw(overall_singletons, true));
restoredTrnmnt.arrangeMatches();
overall_singletons.push(...draw_singletons);

/* Show sixth round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of sixth round matches */
match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[15,5], [6,15]];
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[7,15], [8,15]];
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[15,9], [10,15]];
restoredTrnmnt.add_matchToResults(match);

match = restoredTrnmnt.getNextUnplayedMatch();
match.score = [[11,15], [12,15]];
restoredTrnmnt.add_matchToResults(match);

/* Draw restored compensatory round */
({draw_singletons, draw_matches } = restoredTrnmnt.draw_compensatory(overall_singletons));
restoredTrnmnt.arrangeMatches();

/* Show restored compensatory round */
restoredTrnmnt.showCountedOrder();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

/* Fill score of restored compensatory round matches */
match = restoredTrnmnt.getNextUnplayedMatch();
if(match){
    match.score = [[1,15], [1,15]];
    restoredTrnmnt.add_matchToResults(match);
}


/* Sort and show result of restored tournament */
restoredTrnmnt.sortResults();
restoredTrnmnt.showCountedOrder();


