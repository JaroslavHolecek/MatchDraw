# MatchDraw
JavaScript library for draw of matches on various type of competition.
See JS/showroom.js how to use high-level functions.

## Supported type - actual
    - every2every : aka table or Round-robin https://en.wikipedia.org/wiki/Round-robin_tournament, every individal plays against each other
    - one4each : aka one round of Swiss https://en.wikipedia.org/wiki/Swiss-system_tournament, every individual has one oponent, based on weights between each double of individuals, into weights is possible encode various of possible constraints 

# TODO
    - KO type
    - Weights-generator for one4each for standard constraints (no repetitive match, the closer is score of players the higher chance to select them for match, include score of pravious contestant etc...)
    - Match sorter - to sort matches in plyable maner (no that one player plays consequnenting matches etc.)
    - Maximum weight matching for triples/4/5 etc... (is this even possible/exist some paper for this?)
    - OR statment in asserts -> assert pass if one of mutualy exclusive possibilities occure 
