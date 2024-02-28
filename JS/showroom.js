const {every2every} = require('./Core/MD_MatchGenerator');

console.log("Every 2 Every");
    console.log("- Number list (values)");
    let matches = every2every([10,20,30,40,50,], 2);
    console.log(matches);

    console.log("- Object list (references)");
    matches = every2every([
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
    ], 2);
    console.log(matches);




