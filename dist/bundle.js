(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { NotOverridenFunction, NotSupportedAttributeValue } = require('../Core/MD_Errors');

/**
 * Basic class for tournament participant
 * -> extend it as you need
 */
class MD_Participant{
    /**
     * Constructor of individual participant
     * @param {Int} id id of participant within MactchDraw 
     * @param {string} name string representation of participant
     */
    constructor(id, name){
        this.md_id = id;
        this.md_name = name;
    }

    toJSON(){
        return {
            md_id: this.md_id,
            md_name: this.md_name,
        };
    }

    toString(){
        return `(${this.md_id}) ${this.md_name}`;
    }
}


/**
 * Basic class for storing individual match
 * Each match has its participants and score
 * Extend class for adding another info like duration, place, start_time etc.
 */
class MD_Match{
    /**
     * Constructor of match
     * @param {Int} id id of match within MatchDraw
     * @param {Array[MD_Participant]} participants list of participants in match
     * @param {*} score representation score (like score) of match
     *                   Depends on competition type can has various form
     */
    constructor(id, participants, score=null){
        this.md_id = id;
        this.participants = participants;
        this.score = score;
    }

    toJSON(){
        return {
            md_id: this.md_id,
            participants_md_ids: this.participants.map(participant => participant.md_id),
            score: this.score,
        };
    }

    toString(){
        return `Match ${this.md_id}:\n\tParticipants: ${this.get_all_participants_string()}\n\tScore: ${this.score}`;
    }

    get_participants_MDids(){
        return this.participants.map(participant => participant.md_id);
    }

    get_participants_names(){
        return this.participants.map(participant => participant.md_name);
    }

    get_all_participants_string(){
        return this.participants.map(participant => `${participant.md_name} (${participant.md_id})`).join(" x ");
    }
}

/**
 * Basic class that holds connection between participant and overall result
 */
class MD_Result{
    /**
     * Constructor of Result object
     * @param {MD_Participant} participant participant to whome result belongs
     * @param {Object} result object with various members
     *                        (like points, given score, gained score, batch, etc. ) 
     */
    constructor(participant, result){
        this.participant = participant;
        this.result = result;
    }

    onlyResultToString() {
        let result_str = '';
        for (let key in this.result) {
            result_str += `${key}: ${this.result[key]}, `;
        }
        // Remove the trailing comma and space
        result_str = result_str.slice(0, -2);
        return result_str;
    }

    toString(){
        return `${this.participant} ${this.onlyResultToString()}`;
    }
}

/**
 * Basic class for tournament.
 * Tournament consist of participants and individual matches
 * Extend class for adding another info like place, date etc.
 */
class MD_Tournament{
    constructor(md_id, name, result_template, results_sort_function, participants=[]){
        this.md_id = md_id;
        this.name = name;
        this.matches = [];
        this.results = [];
        this.result_template = result_template;
        this.sortResultsFce = results_sort_function;

        if(participants.length > 0) {this.initAllParticipants(participants);}
    }

    /* ***************************** */
    /* *** TO OVERRIDE FUNCTIONS *** */
    /* ***************************** */

    /**
     * Count match (probably its score) to result form. This result form can be added to result of participant
     * @param {MD_Match} match that will be converted to result form 
     * @return {Array(MD_Result)} array of MD_Results - one for each participant in match 
     */
    count_matchToResult(match){
        /* let index_in_score = match.participants.find(p => p === result.participant); */
        /* if (index_in_score < 0) {throw new Error(`Participant ${participant} not found in its matches - some deep Error happen...`);} */
        throw new NotOverridenFunction('count_matchToResult', 'MD_Tournament');

    }

    draw(must_play_participants=[], prefer_different_club=true){
        throw new NotOverridenFunction('draw', 'MD_Tournament');
    }


    /* ******************************* */
    /* * TO OVERRIDE FUNCTIONS - END * */
    /* ******************************* */
    /* Of course, you can override whatever you want...
        above functions HAVE TO be overriden -> filled
     */
    
    arrangeMatches(){
        console.log("In base-class function arrangeMatches() are matches left in same order they were added.");
    }

    addParticipant(participant){
        this.results.push(new MD_Result(participant, structuredClone(this.result_template.template)));
    }

    initAllParticipants(participants, clear_current=false){
        if (clear_current) {this.results = [];}
        participants.forEach(participant => {
            this.addParticipant(participant);
        });
    }

    getResult_byParticipantMDid(md_id){
        return this.results.find(r => r.participant.md_id === md_id);
    }

    get_participants(){
        return this.results.map(result => result.participant);
    }

    get_participants_MDids(){
        return this.results.map(result => result.participant.md_id);
    }

    get_participants_names(){
        return this.results.map(result => result.participant.name);
    }

    addMatch(match){
        this.matches.push(match);
    }

    getMatch_byMDid(md_id){
        return this.matches.find(m => m.md_id === md_id);
    }

    getMatches_playedOut(){
        return this.matches.filter(match => match.score !== null);
    }

    getMatches_unplayed(){
        return this.matches.filter(match => match.score === null);
    }

    getNextUnplayedMatch(){
        return this.matches.find(m => m.score === null);
    }

    getMatches_ofParticipant(participant){
        return this.matches.filter(match => match.participants.includes(participant));
    }

    setScoreOfMatch(match, score){
        if(match instanceof Int){
            match = this.getMatch_byMDid(match);
        }        
        match.score = score;
    }


    /**
     * Add result of match to tournament results of individual participants of match
     * Use count_matchToResult() function that has to be overriden by your tournament rule
     * @param {*} match match to be accounted
     */
    add_matchToResults(match){
        if (match.score === null){ throw new NotSupportedAttributeValue("match.score", match.score, message = "Only played/filled match can be accounted");}
        this.count_matchToResult(match).forEach(match_result => {
            this.result_template.add(
                this.results.find(r => r.participant === match_result.participant).result,
                match_result.result
                );
        });
    }

    /**
     * Reset all participants result to default (template) value an fill them by all played matches from tournament list of matches
     */
    recount_allResults(){
        this.results.forEach(result => {
            result.result = structuredClone(this.result_template.template);
        });
        this.getMatches_playedOut.forEach(match => {          
            this.add_matchToResults(match, result);
        });
    }

    computeResults_all(){
        this.participants.forEach(participant => {
            this.computeResult(participant);
        });
    }    

    sortResults(){
        this.results.sort((a,b) => {
            return this.sortResultsFce(a.result, b.result);
        });
    }

    showCountedOrder(){
        console.log("Final order:");
        let order = 1;
        this.results.forEach(result => {
            console.log(`\t${order}# ${result}`);
            order++;
        });
    }
}

module.exports = { MD_Participant, MD_Match, MD_Result, MD_Tournament };



},{"../Core/MD_Errors":5}],2:[function(require,module,exports){

/**
 * template is template (like init) of result of participant - intended over whole turnament
 * sort_functions is rule how to compare two results in form of template. Will be used in sort() function
 */
const RESULT_TEMPLATES = {
    POINTS:
    {   template: {points: 0},
        add(to, from){
            to.points += from.points;
        },
        toString(){
            return `${this.points}`;
        },
        sort_functions: {
            /**
             * More points -> better placement
             */
            DESC(r1, r2){
                return r2.points - r1.points;
            }
        }        
    },
    
    SETS_POINTS_GIVE_GET:
    {   template: {sets: 0, points_give: 0, points_get: 0},
        add(to, from){
            to.sets += from.sets;
            to.points_give += from.points_give;
            to.points_get += from.points_get;
        },
        sort_functions: {
            /**
             * 1) More sets -> better placement
             * 2) Higher points_give - points_get -> better placement
             * TODO: Winner of mutual match - list througt matches for r1.participant
             * TODO: random
             */
            SETS_POINTS_DIFF(r1, r2){
                let res = r2.sets - r1.sets;
                if (res !== 0){ return res; }
                
                return (r2.points_give - r2.points_get) -
                    ((r1.points_give - r1.points_get));                
            }
        }
    },
}

module.exports = { RESULT_TEMPLATES };
},{}],3:[function(require,module,exports){
const {
    indexesOfMaxInArray,
    weightsGenerator_Edmonds,
    POLICY_EDMOND_WEIGHTS,
} = require('../Core/MD_Helpers');


const {
    MD_Tournament,
    MD_Participant,
    MD_Result, 
    MD_Match,
} = require('./MD_Competition_base_classes');

const {
    RESULT_TEMPLATES,   
} = require('./MD_Options');

const { one4each } = require('../Core/MD_MatchGenerator');

class Participant_Radon extends MD_Participant{
    constructor(id, name, club, birth_year){
        super(id, name);
        this.club = club;
        this.birth_year = birth_year;
        this.tmp_id; /* temporary id - helper for draw / generating weights */
        this.number_of_played_matches = 0;
    }

    toJSON(){
        let json = super.toJSON();
        json.birth_year = this.birth_year;
        return json;
    }

    toString(){
        return `${super.toString()}\t${this.birth_year}\t${this.club}`;
    }

    toString_full(){
        return `${this.birth_year}, ${this.club}, ${super.toString()}`;
    }
}

class Tournament_Swiss_Radon extends MD_Tournament{
    constructor(id, name, date, in_year_number, participants){
        super(id, name,
            RESULT_TEMPLATES.SETS_POINTS_GIVE_GET,
            RESULT_TEMPLATES.SETS_POINTS_GIVE_GET.sort_functions.SETS_POINTS_DIFF,
            participants );
        this.date = date;
        this.in_year_number = in_year_number;
        this.number_of_played_round = 0;
    }

    count_matchToResult(match){
        /* score = [ [15,6] , [10,15] ] for example */ 
        let allResults = [];
        match.participants.forEach((participant, index) => {
            let res = new MD_Result(participant, structuredClone(this.result_template.template));
            match.score.forEach(set => {
                res.result.points_give += set[index];
                res.result.points_get += set.reduce((a, b) => a + b, 0) - set[index]; /* sum of all points minus given points - in case not only two participants play each other*/
                if (indexesOfMaxInArray(set).includes(index)) {
                    res.result.sets += 1;
                }else{
                    res.result.sets -= 1; /* compute difference of given and get sets if more faire for players that were odd and play less matches */
                }
            });
            allResults.push(res);
        });
        return allResults;
    }

    /* generate weights accounting actual stored order of results (participants) in Tournament
        call sortResults() before this function if you want generate weights for sorted participants
    */
    generate_weights(must_play_participants=[], prefer_different_club=true){
        
        /* set tmp_id as index in array of results/participants */
        this.results.forEach((result, index) => {
            result.participant.tmp_id = index;
        });

        /* init */
        let weights = weightsGenerator_Edmonds(this.results.length, POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR);
        
        /* remove edges of already drawen match -> do not repeat already played matches */
        this.matches.forEach(match => {
            let participants_tmp_id = match.participants.map(p=> p.tmp_id);
            let edge_index = weights.findIndex(w =>
                participants_tmp_id.includes(w[0]) && participants_tmp_id.includes(w[1])
                )
            if (edge_index !== -1){ /* match really found */
                weights.splice(edge_index, 1);
            }
            
        });

        /* increase value of edges of must_play_participants -> no pause second time */
        if(must_play_participants.length > 0){
            let increasing_value = this.results.length; /* higher weight than any other */
            let must_play_participants_tmp_ids = must_play_participants.map(p => p.tmp_id);
            weights.forEach(edge => {
                if(must_play_participants_tmp_ids.includes(edge[0]) || must_play_participants_tmp_ids.includes(edge[1]) ){
                    edge[2] += increasing_value;
                }
            });
        }

        /* decrease value of edges between participant from same club */
        if (prefer_different_club){
            let decreasing_value = 3;
            weights.forEach(edge => {
                if(this.results[edge[0]].participant.club === this.results[edge[1]].participant.club){
                    edge[2] = Math.max(edge[2]-decreasing_value, 0); /* no negative weights */
                }
            });
        }

        return weights;
    }

    generate_weights_compensatory(participants, prefer_different_club=true){
        
        /* set tmp_id as index in array of results/participants */
        this.results.forEach(result => {
            result.participant.tmp_id = -1; /* remove old values */
        });
        participants.forEach((participant, index) => {
            participant.tmp_id = index; /* set actual values */
        });

        /* init */
        let weights = weightsGenerator_Edmonds(participants.length, POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR);
        
        /* remove edges of already drawen match -> do not repeat already played matches */
        this.matches.forEach(match => {
            let participants_tmp_id = match.participants.map(p=> p.tmp_id);
            let edge_index = weights.findIndex(w =>
                participants_tmp_id.includes(w[0]) && participants_tmp_id.includes(w[1])
                )
            if (edge_index !== -1){ /* match really found */
                weights.splice(edge_index, 1);
            }
            
        });

        /* decrease value of edges between participant from same club */
        if (prefer_different_club){
            let decreasing_value = 3;
            weights.forEach(edge => {
                if(participants[edge[0]].club === participants[edge[1]].club){
                    edge[2] = Math.max(edge[2]-decreasing_value, 0); /* no negative weights */
                }
            });
        }

        return weights;
    }

    draw(must_play_participants=[], prefer_different_club=true, compensatory_round=false){
        this.sortResults();

        let participants_to_draw, weights;
        if(compensatory_round){
            participants_to_draw = must_play_participants;
            weights = this.generate_weights_compensatory(participants_to_draw, prefer_different_club);
        }else{
            participants_to_draw = this.results.map(r => r.participant); /* all participants */
            weights = this.generate_weights(must_play_participants, prefer_different_club);
        }

        let {matches, singletons} = one4each(participants_to_draw, weights);
                     
        /* every draw match add to tournament matches */
        let first_draw_match_id = this.matches.length;
        let draw_matches = [];
        matches.forEach((draw_match, draw_id) => {
            draw_matches.push(new MD_Match(first_draw_match_id+draw_id, draw_match));
        });
        this.matches.push(...draw_matches);

        return {draw_singletons: singletons, draw_matches: draw_matches};
    }

    draw_compensatory(participants=[], prefer_different_club=true){
        return this.draw(participants, prefer_different_club, true);
    }
}

module.exports = { Participant_Radon, Tournament_Swiss_Radon };
},{"../Core/MD_Helpers":6,"../Core/MD_MatchGenerator":7,"./MD_Competition_base_classes":1,"./MD_Options":2}],4:[function(require,module,exports){

/**
 * Combinations C(n,k) n choose k
 * @param {int} n 
 * @param {int} k 
 * @returns {Array[Array]}Array of all combinations (Arrays)  
 */
function combinations(n, k = 2) {
    const all_combinations = [];

    // Initialize the combination with the first K elements
    const currentCombination = [];
    for (let i = 0; i < k; i++) {
        currentCombination.push(i);
    }
    all_combinations.push([...currentCombination]);

    // Generate next combinations until exhausted
    while (true) {
        let i = k - 1;
        // Find the rightmost element that can be incremented
        while (i >= 0 && currentCombination[i] === n - k + i) {
            i--;
        }
        if (i === -1) {
            // All combinations have been generated
            break;
        }
        currentCombination[i]++;
        // Update the remaining elements
        for (let j = i + 1; j < k; j++) {
            currentCombination[j] = currentCombination[j - 1] + 1;
        }
        all_combinations.push([...currentCombination]);
    }

    return all_combinations;
}

/**
 * Maximum weight matching https://en.wikipedia.org/wiki/Maximum_weight_matching
 * Currently use Edmonds algorithm.
 * @param {Array[NumberArray[3]]} edges Array of edges in format [node_from, node_to, weight], node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes 
 * @param {Boolean} maximumMatches if True (default), maximum possible count of edges (matches) has prirority over maximum sum of weigts 
 * @returns {Object} object.matched Array[IntArray[2]] list of doubles, indexes of node_from and node_to of selected edges; object.nonmatched IntArray list of non-matched nodes (its indexes)
 * 
 */
function maxWeightMatching(edges, maximumMatches=true){
    const { blossom } = require('./Retrieved/EdmondsBlossom.js');
    const result = blossom(edges, maximumMatches);
    var matched = [];
    var nonmatched = [];
    for (let i_from = 0; i_from < result.length; i_from++) {
        const to = result[i_from];
        if(to === -1){nonmatched.push(i_from);}
        else if (i_from < to){
            matched.push([i_from, to]);
        }
    }

    return {
        matched_edges: matched,
        nonmatched_nodes: nonmatched,
    };
}

module.exports = { combinations, maxWeightMatching };

},{"./Retrieved/EdmondsBlossom.js":8}],5:[function(require,module,exports){
class NotSupportedAttributeValue extends Error{
    constructor(attr_name, attr_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotSupportedAttributeValue";
        this.message = message + `Not support value ${attr_value} for ${attr_name}`;
    } 
}

class NotMatchArguments extends Error{
    constructor(attr1_name, attr1_value, attr2_name, attr2_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotMatchArguments";
        this.message = message + `Atributes ${attr1_name} and ${attr2_name} do not match. Values: ${attr1_value} and ${attr2_value}`;
    } 
}

class NotOverridenFunction extends Error{
    constructor(function_name, base_class_name, message = "", ...args) {
        super(message, ...args);
        this.name = "NotOverridenFunction";
        this.message = message + `Function ${function_name} from ${base_class_name} must be overriden - let it know to developer`;
    } 
}

module.exports = {
    NotSupportedAttributeValue,
    NotMatchArguments,
    NotOverridenFunction
};
},{}],6:[function(require,module,exports){
const { combinations } = require('./MD_Algorithms');
const { NotSupportedAttributeValue, NotMatchArguments } = require('./MD_Errors');

/**
 * Generate two-dimensional array 
 * @param {int} i - first (outter) dimension
 * @param {int} j - secon (inner) dimension 
 * @returns Array[ i*Array[j] ]
 */
function ArrayTwodim(i, j) {
    return Array.from(Array(i), () => new Array(j));
}

function SetRange(max){
    let all =  new Set();
    for (let index = 0; index < max; index++) {
        all.add(index);        
    }
    return all;
}

const POLICY_EDMOND_WEIGHTS = {
    E2E_EQUAL: 0, /* Every to every, each edge has same weights === 1 */
    E2E_SORTED_LINEAR: 1, /* Every to every, weight is linear inverse of distance between indexes (max_distance - distance + 1) */
    E2E_SORTED_FRACTIONAL_LINEAR: 2, /* Every to every, weight is linear fraction of distance between indexes (1 / distance) */
  };

/**
 * Simple generator of weights/edges for one4each() function. Probably you will change some of values by your intention after usage of this function
 * @param {Int} num_individuals number of individuals (number of indexes for wich will be weights generated) 
 * @param {POLICY_EDMOND_WEIGHTS} policy policy for generating weights, see POLICY_EDMOND_WEIGHTS for description
 * @returns Array[NumberArray[3]] Array of edges in format [node_from, node_to, weight], node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes
*/
function weightsGenerator_Edmonds(num_individuals, policy){
    let edges = [];

    switch (policy) {
        case POLICY_EDMOND_WEIGHTS.E2E_EQUAL:
            let comb_equal = combinations(num_individuals, 2);
            comb_equal.forEach(nodes => {
                edges.push([...nodes, 1]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR:
            let comb_sl = combinations(num_individuals, 2);
            comb_sl.forEach(nodes => {
                edges.push([...nodes, num_individuals - Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_FRACTIONAL_LINEAR:
            let comb_fl = combinations(num_individuals, 2);
            comb_fl.forEach(nodes => {
                edges.push([...nodes, 1/Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        default:
          throw new NotSupportedAttributeValue("policy", policy, "use policy from POLICY_EDMOND_WEIGHTS")
    }
    return edges;

}

function selectOneDimFromListByIds(list, ids){
    let outter = ids.length;
    let list_length = list.length;
    let selected = Array(outter);
    let id;
    for (let i = 0; i < outter; i++) {
        id = ids[i];
        if (id >= list_length || id < 0) {
            throw new NotMatchArguments("list", list, "ids", ids, `value ${id} is out of range`);
        }     
        selected[i] = list[id];            
    }   
    return selected;
}

function selectTwoDimFromListByIds(list, ids){
    let outter = ids.length;
    let inner = ids[0].length
    let list_length = list.length;
    let selected = ArrayTwodim(outter, inner);
    for (let j = 0; j < inner; j++) {
        for (let i = 0; i < outter; i++) {    
            id = ids[i][j];
            if (id >= list_length || id < 0) {
                throw new NotMatchArguments("list", list, "ids", ids, `value ${id} is out of range`);
            } 
            selected[i][j] = list[id];            
        }        
    }
    return selected;
}

function indexesOfMaxInArray(array){
    let indexes = [];

    if (array.length == 0){
        return indexes;
    }

    let actual_max = array[0];
    
    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        if(element < actual_max){
            continue;
        }

        if(element === actual_max){
            indexes.push(index);
            continue; 
        }
        
        /* higher than actual_max */
        indexes = [];
        indexes.push(index);
        actual_max = element;
        
    }
    return indexes;
}

function showListOfObjects(message="", obj_list=[]){
    console.log(message)
    obj_list.forEach(obj => {
        console.log(`\t${obj}`);
    });
}

module.exports = {
    ArrayTwodim,
    SetRange,
    POLICY_EDMOND_WEIGHTS,
    weightsGenerator_Edmonds,
    selectOneDimFromListByIds,
    selectTwoDimFromListByIds,
    indexesOfMaxInArray,
    showListOfObjects,
};
},{"./MD_Algorithms":4,"./MD_Errors":5}],7:[function(require,module,exports){
const { NotSupportedAttributeValue } = require('./MD_Errors');
const { combinations, maxWeightMatching } = require('./MD_Algorithms');
const {
    selectOneDimFromListByIds,
    selectTwoDimFromListByIds,
    SetRange, } = require('./MD_Helpers');

/**
 * @typedef {Object} DrawResult
 * @property {Array[Array]} matches - Array of matches that are Array of competitors
 * @property {Array} singletons - Competitors not included in any match
 */

/**
 * Generate matches so that every combination of competitors is included 
 * @param {Array} individuals - Array of individuals that will compete in matches 
 * @param {Integer} num default 2 - number of competitors in one match 
 * @returns {DrawResult} - Result of draw
 */
function every2every(individuals, num = 2){
    let ids = combinations(individuals.length, num);
    return {
        matches : selectTwoDimFromListByIds(individuals, ids),
        singletons : [], /* no singletons in every to every */
    };
}

/**
 * Generate matches so that every Individuals occure in max one match. Maximize sum of edges (connections between individuals)
 * @param {Array} individuals - Array of individuals that will compete in matches
 * @param {Array[IntArray[0]]} weights - Array of edges with weights in format [indexOfIndividual_from, indexOfIndividual_to, weight]
 * @param {Int} num - default 2 (2 is only possible now) - number of competitors in one match 
 * @param {Boolean} maximumMatches - if true -> prefer maximum count of matches over maximum sum of edges
 * @returns {DrawResult} - Result of draw
 */
function one4each(individuals, weights, num = 2, maximumMatches=true){
    if(num != 2){ throw new NotSupportedAttributeValue("num", num, "Only 2 competitors in match available at the moment.")    }
    const draw = maxWeightMatching(weights, maximumMatches);
    
    let ids = SetRange(individuals.length);
    draw.matched_edges.forEach(matched_nodes => {
        ids.delete(matched_nodes[0]);
        ids.delete(matched_nodes[1]);
    });
    draw.nonmatched_nodes.forEach(non_matched_node => {
        ids.delete(non_matched_node);
    });

    let nonmached_ids = draw.nonmatched_nodes;
    ids.forEach(not_proccessed_node => {
        nonmached_ids.push(not_proccessed_node);
    });
    nonmached_ids.sort();
    return {
        matches : selectTwoDimFromListByIds(individuals, draw.matched_edges),
        singletons : selectOneDimFromListByIds(individuals, nonmached_ids),
    }

}



module.exports = {every2every, one4each };
},{"./MD_Algorithms":4,"./MD_Errors":5,"./MD_Helpers":6}],8:[function(require,module,exports){
/*Converted to JS from Python by Matt Krick. Original: http://jorisvr.nl/maximummatching.html*/

/**
 * 
 * @param {Array[NumberArray[3]]} edges Array of edges in format [node_from, node_to, weight], , node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes
 * @param {Boolean} maxCardinality if True, maximum possible count of edges has prirority over maximum sum of weigts 
 * @returns {IntArray} index of array is index of node_from, value is index of node_to of matching edges, -1 if (index) node is not matched
 */
function blossom (edges, maxCardinality = true) {
    if (edges.length === 0) {
      return edges;
    }
    var edmonds = new Edmonds(edges, maxCardinality);
    return edmonds.maxWeightMatching();
  
  };
  
  var Edmonds = function (edges, maxCardinality) {
    this.edges = edges;
    this.maxCardinality = maxCardinality;
    this.nEdge = edges.length;
    this.init();
  };
  
  Edmonds.prototype.maxWeightMatching = function () {
    for (var t = 0; t < this.nVertex; t++) {
      //console.log('DEBUG: STAGE ' + t);
      this.label = filledArray(2 * this.nVertex, 0);
      this.bestEdge = filledArray(2 * this.nVertex, -1);
      this.blossomBestEdges = initArrArr(2 * this.nVertex);
      this.allowEdge = filledArray(this.nEdge, false);
      this.queue = [];
      for (var v = 0; v < this.nVertex; v++) {
        if (this.mate[v] === -1 && this.label[this.inBlossom[v]] === 0) {
          this.assignLabel(v, 1, -1);
        }
      }
      var augmented = false;
      while (true) {
        //console.log('DEBUG: SUBSTAGE');
        while (this.queue.length > 0 && !augmented) {
          v = this.queue.pop();
          //console.log('DEBUG: POP ', 'v=' + v);
          //console.assert(this.label[this.inBlossom[v]] == 1);
          for (var ii = 0; ii < this.neighbend[v].length; ii++) {
            var p = this.neighbend[v][ii];
            var k = ~~(p / 2);
            var w = this.endpoint[p];
            if (this.inBlossom[v] === this.inBlossom[w]) continue;
            if (!this.allowEdge[k]) {
              var kSlack = this.slack(k);
              if (kSlack <= 0) {
                this.allowEdge[k] = true;
              }
            }
            if (this.allowEdge[k]) {
              if (this.label[this.inBlossom[w]] === 0) {
                this.assignLabel(w, 2, p ^ 1);
              } else if (this.label[this.inBlossom[w]] === 1) {
                var base = this.scanBlossom(v, w);
                if (base >= 0) {
                  this.addBlossom(base, k);
                } else {
                  this.augmentMatching(k);
                  augmented = true;
                  break;
                }
              } else if (this.label[w] === 0) {
                //console.assert(this.label[this.inBlossom[w]] === 2);
                this.label[w] = 2;
                this.labelEnd[w] = p ^ 1;
              }
            } else if (this.label[this.inBlossom[w]] === 1) {
              var b = this.inBlossom[v];
              if (this.bestEdge[b] === -1 || kSlack < this.slack(this.bestEdge[b])) {
                this.bestEdge[b] = k;
              }
            } else if (this.label[w] === 0) {
              if (this.bestEdge[w] === -1 || kSlack < this.slack(this.bestEdge[w])) {
                this.bestEdge[w] = k;
              }
            }
          }
        }
        if (augmented) break;
        var deltaType = -1;
        var delta = [];
        var deltaEdge = [];
        var deltaBlossom = [];
        if (!this.maxCardinality) {
          deltaType = 1;
          delta = getMin(this.dualVar, 0, this.nVertex - 1);
        }
        for (v = 0; v < this.nVertex; v++) {
          if (this.label[this.inBlossom[v]] === 0 && this.bestEdge[v] !== -1) {
            var d = this.slack(this.bestEdge[v]);
            if (deltaType === -1 || d < delta) {
              delta = d;
              deltaType = 2;
              deltaEdge = this.bestEdge[v];
            }
          }
        }
        for (b = 0; b < 2 * this.nVertex; b++) {
          if (this.blossomParent[b] === -1 && this.label[b] === 1 && this.bestEdge[b] !== -1) {
            kSlack = this.slack(this.bestEdge[b]);
            ////console.assert((kSlack % 2) == 0);
            d = kSlack / 2;
            if (deltaType === -1 || d < delta) {
              delta = d;
              deltaType = 3;
              deltaEdge = this.bestEdge[b];
            }
          }
        }
        for (b = this.nVertex; b < this.nVertex * 2; b++) {
          if (this.blossomBase[b] >= 0 && this.blossomParent[b] === -1 && this.label[b] === 2 && (deltaType === -1 || this.dualVar[b] < delta)) {
            delta = this.dualVar[b];
            deltaType = 4;
            deltaBlossom = b;
          }
        }
        if (deltaType === -1) {
          //console.assert(this.maxCardinality);
          deltaType = 1;
          delta = Math.max(0, getMin(this.dualVar, 0, this.nVertex - 1));
        }
        for (v = 0; v < this.nVertex; v++) {
          var curLabel = this.label[this.inBlossom[v]];
          if (curLabel === 1) {
            this.dualVar[v] -= delta;
          } else if (curLabel === 2) {
            this.dualVar[v] += delta;
          }
        }
        for (b = this.nVertex; b < this.nVertex * 2; b++) {
          if (this.blossomBase[b] >= 0 && this.blossomParent[b] === -1) {
            if (this.label[b] === 1) {
              this.dualVar[b] += delta;
            } else if (this.label[b] === 2) {
              this.dualVar[b] -= delta;
            }
          }
        }
        //console.log('DEBUG: deltaType', deltaType, ' delta: ', delta);
        if (deltaType === 1) {
          break;
        } else if (deltaType === 2) {
          this.allowEdge[deltaEdge] = true;
          var i = this.edges[deltaEdge][0];
          var j = this.edges[deltaEdge][1];
          var wt = this.edges[deltaEdge][2];
          if (this.label[this.inBlossom[i]] === 0) {
            i = i ^ j;
            j = j ^ i;
            i = i ^ j;
          }
          //console.assert(this.label[this.inBlossom[i]] == 1);
          this.queue.push(i);
        } else if (deltaType === 3) {
          this.allowEdge[deltaEdge] = true;
          i = this.edges[deltaEdge][0];
          j = this.edges[deltaEdge][1];
          wt = this.edges[deltaEdge][2];
          //console.assert(this.label[this.inBlossom[i]] == 1);
          this.queue.push(i);
        } else if (deltaType === 4) {
          this.expandBlossom(deltaBlossom, false);
        }
      }
      if (!augmented) break;
      for (b = this.nVertex; b < this.nVertex * 2; b++) {
        if (this.blossomParent[b] === -1 && this.blossomBase[b] >= 0 && this.label[b] === 1 && this.dualVar[b] === 0) {
          this.expandBlossom(b, true);
        }
      }
    }
    for (v = 0; v < this.nVertex; v++) {
      if (this.mate[v] >= 0) {
        this.mate[v] = this.endpoint[this.mate[v]];
      }
    }
    for (v = 0; v < this.nVertex; v++) {
      //console.assert(this.mate[v] == -1 || this.mate[this.mate[v]] == v);
    }
    return this.mate;
  };
  
  Edmonds.prototype.slack = function (k) {
    var i = this.edges[k][0];
    var j = this.edges[k][1];
    var wt = this.edges[k][2];
    return this.dualVar[i] + this.dualVar[j] - 2 * wt;
  };
  
  Edmonds.prototype.blossomLeaves = function (b) {
    if (b < this.nVertex) {
      return [b];
    }
    var leaves = [];
    var childList = this.blossomChilds[b];
    for (var t = 0; t < childList.length; t++) {
      if (childList[t] <= this.nVertex) {
        leaves.push(childList[t]);
      } else {
        var leafList = this.blossomLeaves(childList[t]);
        for (var v = 0; v < leafList.length; v++) {
          leaves.push(leafList[v]);
        }
      }
    }
    return leaves;
  };
  
  Edmonds.prototype.assignLabel = function (w, t, p) {
    //console.log('DEBUG: assignLabel(' + w + ',' + t + ',' + p + '}');
    var b = this.inBlossom[w];
    //console.assert(this.label[w] === 0 && this.label[b] === 0);
    this.label[w] = this.label[b] = t;
    this.labelEnd[w] = this.labelEnd[b] = p;
    this.bestEdge[w] = this.bestEdge[b] = -1;
    if (t === 1) {
      this.queue.push.apply(this.queue, this.blossomLeaves(b));
      //console.log('DEBUG: PUSH ' + this.blossomLeaves(b).toString());
    } else if (t === 2) {
      var base = this.blossomBase[b];
      //console.assert(this.mate[base] >= 0);
      this.assignLabel(this.endpoint[this.mate[base]], 1, this.mate[base] ^ 1);
    }
  };
  
  Edmonds.prototype.scanBlossom = function (v, w) {
    //console.log('DEBUG: scanBlossom(' + v + ',' + w + ')');
    var path = [];
    var base = -1;
    while (v !== -1 || w !== -1) {
      var b = this.inBlossom[v];
      if ((this.label[b] & 4)) {
        base = this.blossomBase[b];
        break;
      }
      //console.assert(this.label[b] === 1);
      path.push(b);
      this.label[b] = 5;
      //console.assert(this.labelEnd[b] === this.mate[this.blossomBase[b]]);
      if (this.labelEnd[b] === -1) {
        v = -1;
      } else {
        v = this.endpoint[this.labelEnd[b]];
        b = this.inBlossom[v];
        //console.assert(this.label[b] === 2);
        //console.assert(this.labelEnd[b] >= 0);
        v = this.endpoint[this.labelEnd[b]];
      }
      if (w !== -1) {
        v = v ^ w;
        w = w ^ v;
        v = v ^ w;
      }
    }
    for (var ii = 0; ii < path.length; ii++) {
      b = path[ii];
      this.label[b] = 1;
    }
    return base;
  };
  
  Edmonds.prototype.addBlossom = function (base, k) {
    var v = this.edges[k][0];
    var w = this.edges[k][1];
    var wt = this.edges[k][2];
    var bb = this.inBlossom[base];
    var bv = this.inBlossom[v];
    var bw = this.inBlossom[w];
    b = this.unusedBlossoms.pop();
    //console.log('DEBUG: addBlossom(' + base + ',' + k + ')' + ' (v=' + v + ' w=' + w + ')' + ' -> ' + b);
    this.blossomBase[b] = base;
    this.blossomParent[b] = -1;
    this.blossomParent[bb] = b;
    path = this.blossomChilds[b] = [];
    var endPs = this.blossomEndPs[b] = [];
    while (bv !== bb) {
      this.blossomParent[bv] = b;
      path.push(bv);
      endPs.push(this.labelEnd[bv]);
      //console.assert(this.label[bv] === 2 || (this.label[bv] === 1 && this.labelEnd[bv] === this.mate[this.blossomBase[bv]]));
      //console.assert(this.labelEnd[bv] >= 0);
      v = this.endpoint[this.labelEnd[bv]];
      bv = this.inBlossom[v];
    }
    path.push(bb);
    path.reverse();
    endPs.reverse();
    endPs.push((2 * k));
    while (bw !== bb) {
      this.blossomParent[bw] = b;
      path.push(bw);
      endPs.push(this.labelEnd[bw] ^ 1);
      //console.assert(this.label[bw] === 2 || (this.label[bw] === 1 && this.labelEnd[bw] === this.mate[this.blossomBase[bw]]));
      //console.assert(this.labelEnd[bw] >= 0);
      w = this.endpoint[this.labelEnd[bw]];
      bw = this.inBlossom[w];
    }
    //console.assert(this.label[bb] === 1);
    this.label[b] = 1;
    this.labelEnd[b] = this.labelEnd[bb];
    this.dualVar[b] = 0;
    var leaves = this.blossomLeaves(b);
    for (var ii = 0; ii < leaves.length; ii++) {
      v = leaves[ii];
      if (this.label[this.inBlossom[v]] === 2) {
        this.queue.push(v);
      }
      this.inBlossom[v] = b;
    }
    var bestEdgeTo = filledArray(2 * this.nVertex, -1);
    for (ii = 0; ii < path.length; ii++) {
      bv = path[ii];
      if (this.blossomBestEdges[bv].length === 0) {
        var nbLists = [];
        leaves = this.blossomLeaves(bv);
        for (var x = 0; x < leaves.length; x++) {
          v = leaves[x];
          nbLists[x] = [];
          for (var y = 0; y < this.neighbend[v].length; y++) {
            var p = this.neighbend[v][y];
            nbLists[x].push(~~(p / 2));
          }
        }
      } else {
        nbLists = [this.blossomBestEdges[bv]];
      }
      //console.log('DEBUG: nbLists ' + nbLists.toString());
      for (x = 0; x < nbLists.length; x++) {
        var nbList = nbLists[x];
        for (y = 0; y < nbList.length; y++) {
          k = nbList[y];
          var i = this.edges[k][0];
          var j = this.edges[k][1];
          wt = this.edges[k][2];
          if (this.inBlossom[j] === b) {
            i = i ^ j;
            j = j ^ i;
            i = i ^ j;
          }
          var bj = this.inBlossom[j];
          if (bj !== b && this.label[bj] === 1 && (bestEdgeTo[bj] === -1 || this.slack(k) < this.slack(bestEdgeTo[bj]))) {
            bestEdgeTo[bj] = k;
          }
        }
      }
      this.blossomBestEdges[bv] = [];
      this.bestEdge[bv] = -1;
    }
    var be = [];
    for (ii = 0; ii < bestEdgeTo.length; ii++) {
      k = bestEdgeTo[ii];
      if (k !== -1) {
        be.push(k);
      }
    }
    this.blossomBestEdges[b] = be;
    //console.log('DEBUG: blossomBestEdges[' + b + ']= ' + this.blossomBestEdges[b].toString());
    this.bestEdge[b] = -1;
    for (ii = 0; ii < this.blossomBestEdges[b].length; ii++) {
      k = this.blossomBestEdges[b][ii];
      if (this.bestEdge[b] === -1 || this.slack(k) < this.slack(this.bestEdge[b])) {
        this.bestEdge[b] = k;
      }
    }
    //console.log('DEBUG: blossomChilds[' + b + ']= ' + this.blossomChilds[b].toString());
  };
  
  Edmonds.prototype.expandBlossom = function (b, endStage) {
    //console.log('DEBUG: expandBlossom(' + b + ',' + endStage + ') ' + this.blossomChilds[b].toString());
    for (var ii = 0; ii < this.blossomChilds[b].length; ii++) {
      var s = this.blossomChilds[b][ii];
      this.blossomParent[s] = -1;
      if (s < this.nVertex) {
        this.inBlossom[s] = s;
      } else if (endStage && this.dualVar[s] === 0) {
        this.expandBlossom(s, endStage);
      } else {
        var leaves = this.blossomLeaves(s);
        for (var jj = 0; jj < leaves.length; jj++) {
          v = leaves[jj];
          this.inBlossom[v] = s;
        }
      }
    }
    if (!endStage && this.label[b] === 2) {
      //console.assert(this.labelEnd[b] >= 0);
      var entryChild = this.inBlossom[this.endpoint[this.labelEnd[b] ^ 1]];
      var j = this.blossomChilds[b].indexOf(entryChild);
      if ((j & 1)) {
        j -= this.blossomChilds[b].length;
        var jStep = 1;
        var endpTrick = 0;
      } else {
        jStep = -1;
        endpTrick = 1;
      }
      var p = this.labelEnd[b];
      while (j !== 0) {
        this.label[this.endpoint[p ^ 1]] = 0;
        this.label[this.endpoint[pIndex(this.blossomEndPs[b], j - endpTrick) ^ endpTrick ^ 1]] = 0;
        this.assignLabel(this.endpoint[p ^ 1], 2, p);
        this.allowEdge[~~(pIndex(this.blossomEndPs[b], j - endpTrick) / 2)] = true;
        j += jStep;
        p = pIndex(this.blossomEndPs[b], j - endpTrick) ^ endpTrick;
        this.allowEdge[~~(p / 2)] = true;
        j += jStep;
      }
      var bv = pIndex(this.blossomChilds[b], j);
      this.label[this.endpoint[p ^ 1]] = this.label[bv] = 2;
  
      this.labelEnd[this.endpoint[p ^ 1]] = this.labelEnd[bv] = p;
      this.bestEdge[bv] = -1;
      j += jStep;
      while (pIndex(this.blossomChilds[b], j) !== entryChild) {
        bv = pIndex(this.blossomChilds[b], j);
        if (this.label[bv] === 1) {
          j += jStep;
          continue;
        }
        leaves = this.blossomLeaves(bv);
        for (ii = 0; ii < leaves.length; ii++) {
          v = leaves[ii];
          if (this.label[v] !== 0) break;
        }
        if (this.label[v] !== 0) {
          //console.assert(this.label[v] === 2);
          //console.assert(this.inBlossom[v] === bv);
          this.label[v] = 0;
          this.label[this.endpoint[this.mate[this.blossomBase[bv]]]] = 0;
          this.assignLabel(v, 2, this.labelEnd[v]);
        }
        j += jStep;
      }
    }
    this.label[b] = this.labelEnd[b] = -1;
    this.blossomEndPs[b] = this.blossomChilds[b] = [];
    this.blossomBase[b] = -1;
    this.blossomBestEdges[b] = [];
    this.bestEdge[b] = -1;
    this.unusedBlossoms.push(b);
  };
  
  Edmonds.prototype.augmentBlossom = function (b, v) {
    //console.log('DEBUG: augmentBlossom(' + b + ',' + v + ')');
    var i, j;
    var t = v;
    while (this.blossomParent[t] !== b) {
      t = this.blossomParent[t];
    }
    if (t > this.nVertex) {
      this.augmentBlossom(t, v);
    }
    i = j = this.blossomChilds[b].indexOf(t);
    if ((i & 1)) {
      j -= this.blossomChilds[b].length;
      var jStep = 1;
      var endpTrick = 0;
    } else {
      jStep = -1;
      endpTrick = 1;
    }
    while (j !== 0) {
      j += jStep;
      t = pIndex(this.blossomChilds[b], j);
      var p = pIndex(this.blossomEndPs[b], j - endpTrick) ^ endpTrick;
      if (t >= this.nVertex) {
        this.augmentBlossom(t, this.endpoint[p]);
      }
      j += jStep;
      t = pIndex(this.blossomChilds[b], j);
      if (t >= this.nVertex) {
        this.augmentBlossom(t, this.endpoint[p ^ 1]);
      }
      this.mate[this.endpoint[p]] = p ^ 1;
      this.mate[this.endpoint[p ^ 1]] = p;
    }
    //console.log('DEBUG: PAIR ' + this.endpoint[p] + ' ' + this.endpoint[p^1] + '(k=' + ~~(p/2) + ')');
    this.blossomChilds[b] = this.blossomChilds[b].slice(i).concat(this.blossomChilds[b].slice(0, i));
    this.blossomEndPs[b] = this.blossomEndPs[b].slice(i).concat(this.blossomEndPs[b].slice(0, i));
    this.blossomBase[b] = this.blossomBase[this.blossomChilds[b][0]];
    //console.assert(this.blossomBase[b] === v);
  };
  
  Edmonds.prototype.augmentMatching = function (k) {
    var v = this.edges[k][0];
    var w = this.edges[k][1];
    //console.log('DEBUG: augmentMatching(' + k + ')' + ' (v=' + v + ' ' + 'w=' + w);
    //console.log('DEBUG: PAIR ' + v + ' ' + w + '(k=' + k + ')');
    for (var ii = 0; ii < 2; ii++) {
      if (ii === 0) {
        var s = v;
        var p = 2 * k + 1;
      } else {
        s = w;
        p = 2 * k;
      }
      while (true) {
        var bs = this.inBlossom[s];
        //console.assert(this.label[bs] === 1);
        //console.assert(this.labelEnd[bs] === this.mate[this.blossomBase[bs]]);
        if (bs >= this.nVertex) {
          this.augmentBlossom(bs, s);
        }
        this.mate[s] = p;
        if (this.labelEnd[bs] === -1) break;
        var t = this.endpoint[this.labelEnd[bs]];
        var bt = this.inBlossom[t];
        //console.assert(this.label[bt] === 2);
        //console.assert(this.labelEnd[bt] >= 0);
        s = this.endpoint[this.labelEnd[bt]];
        var j = this.endpoint[this.labelEnd[bt] ^ 1];
        //console.assert(this.blossomBase[bt] === t);
        if (bt >= this.nVertex) {
          this.augmentBlossom(bt, j);
        }
        this.mate[j] = this.labelEnd[bt];
        p = this.labelEnd[bt] ^ 1;
        //console.log('DEBUG: PAIR ' + s + ' ' + t + '(k=' + ~~(p/2) + ')');
  
  
      }
    }
  };
  
  
  //INIT STUFF//
  Edmonds.prototype.init = function () {
    this.nVertexInit();
    this.maxWeightInit();
    this.endpointInit();
    this.neighbendInit();
    this.mate = filledArray(this.nVertex, -1);
    this.label = filledArray(2 * this.nVertex, 0); //remove?
    this.labelEnd = filledArray(2 * this.nVertex, -1);
    this.inBlossomInit();
    this.blossomParent = filledArray(2 * this.nVertex, -1);
    this.blossomChilds = initArrArr(2 * this.nVertex);
    this.blossomBaseInit();
    this.blossomEndPs = initArrArr(2 * this.nVertex);
    this.bestEdge = filledArray(2 * this.nVertex, -1); //remove?
    this.blossomBestEdges = initArrArr(2 * this.nVertex); //remove?
    this.unusedBlossomsInit();
    this.dualVarInit();
    this.allowEdge = filledArray(this.nEdge, false); //remove?
    this.queue = []; //remove?
  };
  Edmonds.prototype.blossomBaseInit = function () {
    var base = [];
    for (var i = 0; i < this.nVertex; i++) {
      base[i] = i;
    }
    var negs = filledArray(this.nVertex, -1);
    this.blossomBase = base.concat(negs);
  };
  Edmonds.prototype.dualVarInit = function () {
    var mw = filledArray(this.nVertex, this.maxWeight);
    var zeros = filledArray(this.nVertex, 0);
    this.dualVar = mw.concat(zeros);
  };
  Edmonds.prototype.unusedBlossomsInit = function () {
    var i, unusedBlossoms = [];
    for (i = this.nVertex; i < 2 * this.nVertex; i++) {
      unusedBlossoms.push(i);
    }
    this.unusedBlossoms = unusedBlossoms;
  };
  Edmonds.prototype.inBlossomInit = function () {
    var i, inBlossom = [];
    for (i = 0; i < this.nVertex; i++) {
      inBlossom[i] = i;
    }
    this.inBlossom = inBlossom;
  };
  Edmonds.prototype.neighbendInit = function () {
    var k, i, j;
    var neighbend = initArrArr(this.nVertex);
    for (k = 0; k < this.nEdge; k++) {
      i = this.edges[k][0];
      j = this.edges[k][1];
      neighbend[i].push(2 * k + 1);
      neighbend[j].push(2 * k);
    }
    this.neighbend = neighbend;
  };
  Edmonds.prototype.endpointInit = function () {
    var p;
    var endpoint = [];
    for (p = 0; p < 2 * this.nEdge; p++) {
      endpoint[p] = this.edges[~~(p / 2)][p % 2];
    }
    this.endpoint = endpoint;
  };
  Edmonds.prototype.nVertexInit = function () {
    var nVertex = 0;
    for (var k = 0; k < this.nEdge; k++) {
      var i = this.edges[k][0];
      var j = this.edges[k][1];
      if (i >= nVertex) nVertex = i + 1;
      if (j >= nVertex) nVertex = j + 1;
    }
    this.nVertex = nVertex;
  };
  Edmonds.prototype.maxWeightInit = function () {
    var maxWeight = 0;
    for (var k = 0; k < this.nEdge; k++) {
      var weight = this.edges[k][2];
      if (weight > maxWeight) {
        maxWeight = weight;
      }
    }
    this.maxWeight = maxWeight;
  };
  
  //HELPERS//
  function filledArray(len, fill) {
    var i, newArray = [];
    for (i = 0; i < len; i++) {
      newArray[i] = fill;
    }
    return newArray;
  }
  
  function initArrArr(len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
      arr[i] = [];
    }
    return arr;
  }
  
  function getMin(arr, start, end) {
    var min = Infinity;
    for (var i = start; i <= end; i++) {
      if (arr[i] < min) {
        min = arr[i];
      }
    }
    return min;
  }
  
  function pIndex(arr, idx) {
    //if idx is negative, go from the back
    return idx < 0 ? arr[arr.length + idx] : arr[idx];
  }

  module.exports = {blossom};
},{}],9:[function(require,module,exports){
const {RESULT_TEMPLATES} = require('./Competition/MD_Options');
const {Participant_Radon, Tournament_Swiss_Radon} = require('./Competition/MD_Swiss_Radon');

console.log("See examples in showroom directory for usage example.");

module.exports = { RESULT_TEMPLATES, Participant_Radon, Tournament_Swiss_Radon };
},{"./Competition/MD_Options":2,"./Competition/MD_Swiss_Radon":3}]},{},[9]);
