const {every2every, one4each} = require('./Core/MD_MatchGenerator');

let draw;
let matches;
let singles;
console.log("Every 2 Every");
    console.log("\t- Number list (values)");
    draw = every2every([10,20,30,40,50,], 2);
    matches = draw.matches;
    singles = draw.singletons;
    console.log("\t\tMatches: ");
    matches.forEach(match => {
        console.log("\t\t\t", match[0], match[1]);
    });
    console.log("\t\tSingles: ");
    singles.forEach(single => {
        console.log("\t\t\t", single);
    });

    console.log("\t- Object list (references)");
    draw = every2every([
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
    ], 2);
    matches = draw.matches;
    singles = draw.singletons;
    console.log("\t\tMatches: ");
    matches.forEach(match => {
        console.log("\t\t\t", match[0], match[1]);
    });
    console.log("\t\tSingles: ");
    singles.forEach(single => {
        console.log("\t\t\t", single);
    });

console.log("One 4 Each");
    console.log("\t- Number list (values)");
    draw = one4each(
        [10,20,30,40,50,],
        [ /* edges -> [index_from, index_to, weight] */
            [0,1,10],
            [0,2,20],
            [1,2,10],
            [2,3,30],
            [3,4,10]
        ]);    
    matches = draw.matches;
    singles = draw.singletons;
    console.log("\t\tMatches: ");
    matches.forEach(match => {
        console.log("\t\t\t", match[0], match[1]);
    });
    console.log("\t\tSingles: ");
    singles.forEach(single => {
        console.log("\t\t\t", single);
    });

    console.log("\t- Object list (references)");
    draw = one4each(
        [
            {name: "Alice"},
            {name: "Bob"},
            {name: "Cecile"},
            {name: "David"},
            {name: "Eliska"},
            {name: "Franta"},
        ],
        [ /* edges -> [index_from, index_to, weight] */
            [0,1,10],
            [0,2,20],
            [1,2,10],
            [2,3,30],
            [3,4,10]
        ]);
    matches = draw.matches;
    singles = draw.singletons;
    console.log("\t\tMatches: ");
    matches.forEach(match => {
        console.log("\t\t\t", match[0], match[1]);
    });
    console.log("\t\tSingles: ");
    singles.forEach(single => {
        console.log("\t\t\t", single);
    });




