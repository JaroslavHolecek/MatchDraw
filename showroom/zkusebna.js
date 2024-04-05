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
        new Participant_Radon(5, "Eliška", "Kladno", "2010"),
        new Participant_Radon(6, "Franta", "Kladno", "2010"),
        new Participant_Radon(7, "Gábina", "Praha", "2010"),
        new Participant_Radon(8, "Honza", "Praha", "2010"),
        new Participant_Radon(9, "Iveta", "Kladno", "2010"),
        new Participant_Radon(10, "Jarda", "Kladno", "2010"),
        new Participant_Radon(11, "Klárka", "Praha", "2010"),
        new Participant_Radon(12, "Lukáš", "Praha", "2010"),
        new Participant_Radon(13, "Monika", "Kladno", "2010"),
        new Participant_Radon(14, "Nevim", "Kladno", "2010"),
        new Participant_Radon(15, "Ota", "Praha", "2010"),
        new Participant_Radon(16, "Pavlína", "Praha", "2010"),
        new Participant_Radon(17, "Quido", "Kladno", "2010"),
        new Participant_Radon(18, "Radka", "Kladno", "2010"),
        new Participant_Radon(19, "Standa", "Praha", "2010"),
        new Participant_Radon(20, "Terka", "Praha", "2010"),
        new Participant_Radon(21, "Uršula", "Kladno", "2010"),
        new Participant_Radon(22, "Vašek", "Kladno", "2010"),
        new Participant_Radon(23, "Wendy", "Praha", "2010"),
        new Participant_Radon(24, "Xaver", "Praha", "2010"),
        new Participant_Radon(25, "Ylona", "Kladno", "2010"),
        new Participant_Radon(26, "Zdeněk", "Kladno", "2010"),
    ]
);


/* Time test for drawing a lot of participants */
let {draw_singletons, draw_matches } = showroomTournament.draw();
showListOfObjects("Participants without match:", draw_singletons);
showListOfObjects("Matches:", draw_matches);

console.log(JSON.stringify(showroomTournament));