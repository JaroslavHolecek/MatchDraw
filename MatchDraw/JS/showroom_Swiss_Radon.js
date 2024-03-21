const {
    MD_Tournament,
    MD_Participant,    
} = require('./Swiss_Radon');

const {
    RESULT_TEMPLATES,   
} = require('./Options');

let showroomTournament = new MD_Tournament(
    1,
    "Showroom Tournament",
    RESULT_TEMPLATES.POINTS,
    RESULT_TEMPLATES.POINTS.DESC,
    [
        new MD_Participant(1, "Adam"),
        new MD_Participant(2, "Bára"),
        new MD_Participant(3, "Cyril"),
        new MD_Participant(4, "David"),
    ]
);
showroomTournament.addParticipant(new MD_Participant(5, "Eliška"));

/* this function has to be overriden - draw of matches - see /JS/Core/MD_MatchGenerator */
let {draw_matches, draw_singletons} = showroomTournament.draw();
console.log(`In this round will not play: ${draw_singletons.length} players: ${draw_singletons}`);
showroomTournament.arrangeMatches();

let match = showroomTournament.getNextUnplayedMatch();
console.log(match);
match.score = [[15,10], [15,4]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
console.log(match);
match.score = [[15,9], [6,15]];
showroomTournament.add_matchToResults(match);

({draw_matches, draw_singletons} = showroomTournament.draw());
match = showroomTournament.getNextUnplayedMatch();
console.log(match);
match.score = [[8,15], [15,11]];
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
console.log(match);
match.score = [[1,15], [0,15]];
showroomTournament.add_matchToResults(match);

showroomTournament.sortResults();

showroomTournament.showCountedOrder();
