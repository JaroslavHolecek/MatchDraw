// Another file (e.g., main.js)

const {every2every} = require('./Core/MD_MatchGenerator');

// Creating individual players
let matches = every2every([10,20,30,40,50], 2);

console.log("Start");
console.log(matches);
