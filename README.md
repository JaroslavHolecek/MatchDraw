# MatchDraw
JavaScript library for draw of matches on various type of competition.

See showroom/[...].js how to use high-level functions.

## Install
`npm install matchdraw`

In html use `<script src="path/to/matchdraw/dist/bundle.js"></script>`

## Supported type - actual
 - every2every : aka table or Round-robin https://en.wikipedia.org/wiki/Round-robin_tournament, every individal plays against each other
 - one4each : aka one round of Swiss https://en.wikipedia.org/wiki/Swiss-system_tournament, every individual has one oponent, based on weights between each double of individuals, into weights is possible encode various constraints like same club, distance in order etc... 


## Philosphy
I wish everyone could organize a nice tournament for their friends. Sit at the table/computer during whole event is not an activity corresponding to the 21st century.
This is core package used in my other project BadMatch to do this monotone and boring process for you.
Usage is free as a lot of active people have not enough money or time for licencing "nonsense".
If you have enough money and this tool was useful for you - it would make me happy if you make some contribution (see below).

## Code philosophy
Code is build mainly as Composition over Inheritence.

## Contribution
You can contribute to project and/or make author happy via

 * find bugs and/or improvements
 * propose new tournament types
 * invite me ( holecek.jaroslav@email.cz ) to your tournament - I like to play everything or just meet new people :-)
 * send some money via
    - paypal: https://paypal.me/JaroslavHolecek
    - bank (czk): 2302921023 / 2010  SS: 68826587
    - <img src="misc/QRPlatba_MatchDraw.png" width="200px" alt="Bank account (CZK): 2302921023 / 2010  SS: 68826587"/>




# TODO
 - documentation...
 - remove edges of already drawen match in generate_weights() -> somehow code on only one place -> unite generate_weights_compensatory() with generate_weights()
 - good names for tournament/counting types
 - Test for Tournaments/Matches/Participants
 - KO type
 - Weights-generator for one4each for standard constraints (no repetitive match, the closer is score of players the higher chance to select them for match, include score of pravious contestant etc...)
 - Match sorter - to sort matches in plyable maner (no that one player plays consequnenting matches etc.)
 - Maximum weight matching for triples/4/5 etc... (is this even possible/exist some paper for this?)
 - OR statment in asserts -> assert pass if one of mutualy exclusive possibilities occure 
 - check if weigths/draw can be done better via flow
