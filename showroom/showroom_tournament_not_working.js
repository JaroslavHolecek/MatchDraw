const {
    MD_Tournament,
    MD_Participant,    
} = require('../src/Competition/MD_Competition_base_classes');

const {
    RESULT_TEMPLATES,   
} = require('../src/Competition/MD_Options');

/*  ! ! ! This is not working example ! ! !
 -> it is needed to override "NotOverridenFunction" in base classes
    See showroom_[specific tournament type].js for working example
*/

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
showroomTournament.draw();

showroomTournament.arrangeMatches();

let match = showroomTournament.getNextUnplayedMatch();
console.log(match);

/* match.score = [3,5]; // alternatively */
/* showroomTournament.setScore(match, [3,5]); // alternatively */
showroomTournament.setScore(match.md_id, [3,5]);
showroomTournament.add_matchToResults(match);

match = showroomTournament.getNextUnplayedMatch();
console.log(match);
match.score = [2,1];
showroomTournament.add_matchToResults(match);

/* ... etc */

/* or compute all results at once - for example when one result depends on other... */
showroomTournament.recount_allResults();

showroomTournament.sortResults();

showroomTournament.showCountedOrder();
