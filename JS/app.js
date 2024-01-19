// Another file (e.g., main.js)

const { IndividualPlayer, comparePlayers } = require('./individual');

// Creating individual players
let player1 = new IndividualPlayer("Alice", 101, 150);
let player2 = new IndividualPlayer("Bob", 102, 150);

// Displaying player info
player1.displayInfo();
player2.displayInfo();

// Comparing players
console.log(comparePlayers(player1, player2));
