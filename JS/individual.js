// Filename: individual.js

const Enum = (keys) => {
    const obj = {};
    keys.forEach(key => {
        obj[key] = Symbol(key);
    });
    return Object.freeze(obj);
};

const AREA_LEVEL = Enum(["COUNTRY", "COUNTRY_REGION", "CITY", "CITY_REGION", "CLUB", "CLUB_TEAM"]);

// Define a base class with shared attributes and methods
class PlaceableToAreas {
    constructor() {
        this._areas = new Set();
    }

    get areas() {
        return this._areas;
    }

    addToArea(a){
        if (! a instanceof Area){
            throw new Error(`${a} is not Area`);
        }
        /* TDOD: check recursively duplication */
        this.areas.add(a);
    }

    /**
     * Displays the areas to which the object belongs.
     */
    displayAreas(displayLevel = 0, recursively = false) {
        const spaces = '  '.repeat(displayLevel);
        console.log(`${spaces}Belongs to the following areas:`);
        
        this.areas.forEach(area => {
            console.log(`${spaces} - ${area}`);
            if (recursively){
                console.log(area.displayAreas(displayLevel+1, true));
            }
        });
    }

}

/**
 * Represents an area such as a club, town, or country.
 */
class Area extends PlaceableToAreas {
    /**
     * Constructs a new Area object.
     * @param {string} name - The name of the area.
     * @param {string} areaLevel - Level of the area - from AREA_LEVEL.
     */
    constructor(name, areaLevel) {
        this.name = name;
        this._areaLevel = areaLevel;
    }

    get areaLevel() {
      return this._areaLevel;
    }
    set areaLevel(al) {
        if (!Object.values(AREA_LEVEL).includes(al)) {
            throw new Error("Invalid Area level");
        }
        this._areaLevel = al;
    }

    toString() {
        return `${this.areaLevel}: ${this.name}`;
    }
}

/**
 * Represents an individual player.
 */
class IndividualPlayer extends PlaceableToAreas {
    /**
     * Constructs a new IndividualPlayer object.
     * @param {string} name - The name of the player.
     * @param {number} id - The ID of the player.
     */
    constructor(name, id, score) {
        this.name = name;
        this.id = id;
        this.score = score;
    }

    toString() {
        return `Player ID: ${this.id}, Name: ${this.name}`;
    }
}

/**
 * Compares two IndividualPlayer objects based on their scores.
 * @param {IndividualPlayer} player1 - The first player to compare.
 * @param {IndividualPlayer} player2 - The second player to compare.
 * @returns {string} - A message indicating which player has a higher score, or if they are equal.
 */
function comparePlayers(player1, player2) {
    if (player1.name > player2.name) {
        return `${player1.name} has a higher score than ${player2.name}.`;
    } else if (player1.score < player2.score) {
        return `${player2.name} has a higher score than ${player1.name}.`;
    } else {
        return `${player1.name} and ${player2.name} have equal scores.`;
    }
}

// Exporting the IndividualPlayer class and the comparePlayers function.
module.exports = { IndividualPlayer, comparePlayers, Area };
