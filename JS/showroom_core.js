const {
    every2every,
    one4each,
    
} = require('./Core/MD_MatchGenerator');
const {
    POLICY_EDMOND_WEIGHTS,
    weightsGenerator_Edmonds,
} = require('./Core/MD_Helpers');

function showDrawNumber(individuals, draw){
    console.log("Players:", individuals.join(", "));
    console.log("Matches: ");
    draw.matches.forEach(match => {
        console.log("\t", match.join(" x "));
    });
    console.log("Singles: ");
        console.log("\t", draw.singletons.join(", "));
}

function showDrawNames(individuals, draw){
    function getName(item) {
        return [item.name];
    }
    console.log("Players:", individuals.map(getName).join(", "));
    console.log("Matches: ");
    draw.matches.forEach(match => {
        console.log("\t", match.map(getName).join(" x "));
    });
    console.log("Singles: ");
        console.log("\t", draw.singletons.map(getName).join(", "));
}

let draw;
let players;
console.log("Every 2 Every");
    console.log("- Number list (values)");
    players = [10,20,30,40,50,];
    draw = every2every(players, 2);
    showDrawNumber(players, draw);

    console.log("- Object list (references)");
    players = [
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
    ];
    draw = every2every(players, 2);
    showDrawNames(players, draw);

let weights;
console.log("One 4 Each");
    console.log("- Number list (values)");
    players = [10,20,30,40,50,];
    weights = [ /* edges -> [index_from, index_to, weight] */
        [0,1,10],
        [0,2,20],
        [1,2,10],
        [2,3,30],
        [3,4,10]
    ];
    draw = one4each(players, weights);    
    showDrawNumber(players, draw);

    console.log("- Object list (references)");
    players = [
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
        {name: "Eliska"}, /* see in weights, that Eliska is connected only to one edge with low weight */
        {name: "Franta"}, /* see in weights, that Franta is not conneced to any edge */
    ];
    weights = [ /* edges -> [index_from, index_to, weight] */
        [0,1,10],
        [0,2,30],
        [1,2,10],
        [1,3,30],
        [3,4,10],
    ];
    draw = one4each(players, weights);
    showDrawNames(players, draw);

    console.log("- Generated wights - Equal");
    players = [
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
        {name: "Eliska"}, 
        {name: "Franta"}, 
    ];
    weights = weightsGenerator_Edmonds(players.length, POLICY_EDMOND_WEIGHTS.E2E_EQUAL);
    draw = one4each(players, weights);
    showDrawNames(players, draw);

    console.log("- Generated wights - the closer to each other in list, the higher weight");
    players = [
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
        {name: "Eliska"}, 
        {name: "Franta"}, 
    ];
    weights = weightsGenerator_Edmonds(players.length, POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR);
    draw = one4each(players, weights);
    showDrawNames(players, draw);

    console.log("- Generated wights - the closer to each other in list, the higher weight + some edges removed");
    players = [
        {name: "Alice"},
        {name: "Bob"},
        {name: "Cecile"},
        {name: "David"},
        {name: "Eliska"}, 
        {name: "Franta"}, 
    ];
    weights = weightsGenerator_Edmonds(players.length, POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR);
    for (let index = 0; index < 5; index++) { /* remove all edges of Alice */
        weights.shift();        
    } 
    draw = one4each(players, weights);
    showDrawNames(players, draw);








