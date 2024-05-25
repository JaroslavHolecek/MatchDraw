(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MatchDraw = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const {
    MD_MasterClass
} = require('./MD_MasterClass');
const {
    NotSupportedAttributeValue,
    IncorrectValues
} = require('../Core/MD_Errors');
const {
    MD_Result_Points
} = require('./MD_Result');
const {
    MD_Participant
} = require('./MD_Participant');
const {
    MD_Match
} = require('./MD_Match');
const { 
    MD_Match2Results
} = require('./MD_Match2Results');
const { 
    every2every
} = require('../Core/MD_MatchGenerator');

/**
 * Object used as parameter to draw() function.
 * @typedef {Object} MD_arg_Draw
 * For example in Swiss_Radon:
 * @property {Array<MD_Participant>} must_play_participants - Array of participants that have to be drawen (for example already have free round).
 * @property {Number} prefer_different_club - How much is penalized drawing of participants from same club to same match, 0 is no penalization so same club do not matter
 * ... etc
 */

/**
 * Basic class that holds connection between participant and overall result
 */
class MD_ParticipantResult extends MD_MasterClass {
    static md_description = "Hold connection between participant and its result."
    static md_name = "Participant's result";
    static innerClassParticipant = MD_Participant;
    static innerClassResult = MD_Result_Points;

    /* #data={md_participant:innerClassParticipant, md_result:innerClassResult} */
    static data_check(data, check_inner=false){
        if(!('md_participant' in data)){
            throw new IncorrectValues(this.md_name, "md_participant has to be set");
        }
        if(!('md_result' in data)){
            throw new IncorrectValues(this.md_name, "md_result has to be set");
        }

        if(check_inner){
            this.innerClassParticipant.data_check(data.md_participant);
            this.innerClassResult.data_check(data.md_result);
        }

    }

    constructor(gg/*={md_participant:innerClassParticipant, md_result:innerClassResult}*/){
        super(gg);
        this.md_participant = gg.md_participant;        
        this.md_result = gg.md_result        
    }
    get md_participant(){return this.md_data.md_participant;}
    set md_participant(participant){this.md_data.md_participant = new this.constructor.innerClassParticipant(participant);}
    get md_result(){return this.md_data.md_result;}
    set md_result(result){this.md_data.md_result = new this.constructor.innerClassResult(result);}

    toString(){
        return `${this.md_participant.toString()}\n\t${this.md_result.toString()}`;
    }

    toJSON(){
        return {
            md_participant: this.md_participant.toJSON(),
            md_result: this.md_result.toJSON()
        };
    }

    /* todo: remove? */
    // onlyResultToString() {
    //     let result_str = '';
    //     for (let key in this.result) {
    //         result_str += `${key}: ${this.result[key]}, `;
    //     }
    //     // Remove the trailing comma and space
    //     result_str = result_str.slice(0, -2);
    //     return result_str;
    // }
}

/**
 * Basic class for tournament.
 * Tournament consist of participants with its results and individual matches
 * Extend class for adding another info like place, date etc.
 */
class MD_Competition extends MD_MasterClass {
    static md_description = "Basic class for competition. Consist of id, name, participants with its results and matches.";
    static md_name = "Basic competition";
    static innerClassParticipantResult = MD_ParticipantResult;
    static innerClassMatch = MD_Match;
    static defaultSortResultFce = MD_Result_Points.sort_functions.DIFF

    /* #data={md_id:Number, md_name:String, md_participants_results:Array<innerClassParticipantResult>, md_matches:Array<innerClassMatch>} */
    static data_check(data){
        if(!('md_id' in data)){
            throw new IncorrectValues(this.md_name, "md_id has to be set");
        }
        if(!('md_name' in data)){
            throw new IncorrectValues(this.md_name, "md_name has to be set");
        }
        if(!('md_participants_results' in data)){
            throw new IncorrectValues(this.md_name, "md_participants_results has to be set");
        }
        if(!Array.isArray(data.md_participants_results)){
            throw new IncorrectValues(this.md_name, "md_participants_results has to be Array");
        }
        if(!('md_matches' in data)){
            throw new IncorrectValues(this.md_name, "md_matches has to be set");
        }
        if(!Array.isArray(data.md_matches)){
            throw new IncorrectValues(this.md_name, "md_matches has to be Array");
        }

        data.md_participants_results.forEach(prtcpnt_rslt => {
            this.innerClassParticipantResult.data_check(prtcpnt_rslt);
        });

        data.md_matches.forEach(mtch => {
            this.innerClassMatch.data_check(mtch);
        });
    }

    constructor(gg/*={md_id:Number, md_name"String}*/){
        gg.md_participants_results = gg.md_participants_results || [];
        gg.md_matches = gg.md_matches || [];
        super(gg);
        this.md_participants_results = gg.md_participants_results; /* trigger setter */
        this.md_matches = gg.md_matches; /* trigger setter */
    }
    set md_id(id){this.md_data.md_id = id;}
    get md_id(){return this.md_data.md_id;}
    set md_name(name){this.md_data.md_name = name;}
    get md_name(){return this.md_data.md_name;}
    get md_participants_results(){return this.md_data.md_participants_results;}
    set md_participants_results(participants_results){
        if(!Array.isArray(participants_results)){
            throw new IncorrectValues(this.md_name, "participants_results has to be Array");
        }
        this.md_data.md_participants_results = participants_results.map(prtcpnt_rslt => {return new this.constructor.innerClassParticipantResult(prtcpnt_rslt)});
    }
    get md_matches(){return this.md_data.md_matches;}
    set md_matches(matches){
        if(!Array.isArray(matches)){
            throw new IncorrectValues(this.md_name, "md_matches has to be Array");
        }
        this.md_data.md_matches = matches.map(mtch => {return new this.constructor.innerClassMatch(mtch)});
    }

    toJSON(){
        return {
            md_id: this.md_id,
            md_name: this.md_name,
            md_participants_results: this.md_participants_results.map(prt_rslt => prt_rslt.toJSON()),             
            md_matches: this.md_matches.map(mtch => mtch.toJSON()),
        };
    }

    static preprocesJSON(parsedJSON){
        let participants_results = [];
        let matches = [];

        parsedJSON.md_participants_results.forEach(inner => {
            participants_results.push(this.innerClassParticipantResult.fromJSON(inner));
        });

        let participants = participants_results.map(prt_res => prt_res.md_participant);
        parsedJSON.md_matches.forEach(match => {
            matches.push(this.innerClassMatch.fromJSON(match, participants));
        });

        return {
            md_id: parsedJSON.md_id,
            md_name: parsedJSON.md_name,
            md_participants_results: participants_results,
            md_matches: matches
        };
    }

    /* ***************************** */
    /* *** TO OVERRIDE FUNCTIONS *** */
    /* ***************************** */

    /**
     * Count match (probably its score) to result form and connect it with individual participants.
     * This result form can be added to result of participant
     * @param {MD_Match} match that will be converted to result form 
     * @return {Array(MD_Result)} array of MD_Results used in tournament - one for each participant in match 
     */
    match2results(match){
        return MD_Match2Results.simpleScore2points(match);
    }

    /**
     * Used to be called via draw() function, this schema allow pass arguments that may change
     * in time of tournament running (for example not draw until all match are played or change some seting round to round)
     * Every2every used for this default example need no settings, so arg_obj is not used 
     * @param {MD_arg_Draw} arg_obj object with draw parameters (depend on tournament type and expectation/implementation)
     * @returns {object<draw_singletons, draw_matches>}
     * draw_singletons is Array of participants with no match, 
     * draw_matches is Array<Array> of drawed matches, that are array of participants in match
     */
    draw_inner(arg_obj){
        let {matches, singletons} = every2every(this.get_participants());
        let draw_matches = [];
        let first_id = this.md_matches.length+1;
        matches.forEach((mtch, index) => {
            draw_matches.push(new this.constructor.innerClassMatch({
                md_id: first_id + index,
                md_participants: mtch
            }))            
        });
        this.md_matches.push(...draw_matches);
        console.log("Added matches: every to every");
        return {
            draw_singletons: singletons,
            draw_matches: matches
        };
    }

    /**
     * Used to call draw_inner() function, this schema allow pass arguments that may change
     * in time of tournament running (for example not draw until all match are played or change some seting round to round)
     * @param {MD_arg_Draw} arg_obj object with draw parameters (depend on tournament type and expectation/implementation)
     * @returns {object<draw_singletons, draw_matches>}
     * draw_singletons is Array of participants with no match, 
     * draw_matches is Array<Array> of drawed matches, that are array of participants in match
     */
    draw(){
        /* in typical schema arg_obj is constructed or changed here */
        let arg_obj = {}
        return this.draw_inner(arg_obj);
    }

    /* ******************************* */
    /* * TO OVERRIDE FUNCTIONS - END * */
    /* ******************************* */
    /* Of course, you can override whatever you want...
        above functions PROBABLY WILL BE overriden
     */

    /**
     * Count match (probably its score) to result form and connect it with individual participants.
     * This result form can be added to result of participant
     * @param {MD_Match} match that will be converted to result form 
     * @return {Array(MD_ParticipantResult)} array of MD_Results used in tournament - one for each participant in match 
     */
    transform_matchToParticipantsResults(match){
        /* let index_in_score = match.participants.find(p => p === result.participant); */
        /* if (index_in_score < 0) {throw new Error(`Participant ${participant} not found in its matches - some deep Error happen...`);} */
        // throw new NotOverridenFunction('transform_matchToResults', this.name);
        let res = [];
        this.match2results(match).forEach((rslt, index) => {
            res.push(new this.constructor.innerClassParticipantResult(
                {
                    md_participant: match.md_participants[index],
                    md_result: rslt
                }
            ));
        });
        return res; 
    }

    arrangeMatches(){
        console.log("In base-class function arrangeMatches() are matches left in same order they were added.");
    }

    addParticipant(participant){
        this.md_participants_results.push(
            new this.constructor.innerClassParticipantResult({
                md_participant:participant,
                md_result: new this.constructor.innerClassParticipantResult.innerClassResult()
            })
        );
    }

    resetAllResults(){
        this.md_participants_results.forEach(prt_rslt => {
           prt_rslt.md_result.reset()});
    }

    getParticipantResult_byParticipantMDid(md_id){
        return this.md_participants_results.find(pr => pr.md_participant.md_id === md_id);
    }

    get_participants(){
        return this.md_participants_results.map(pr => pr.md_participant);
    }

    get_participants_MDids(){
        return this.md_participants_results.map(pr => pr.md_participant.md_id);
    }

    get_participants_names(){
        return this.md_participants_results.map(pr => pr.md_participant.md_name);
    }

    addMatch(match){
        this.md_matches.push(new this.constructor.innerClassMatch(match));
    }

    getMatch_byMDid(md_id){
        return this.md_matches.find(m => m.md_id === md_id);
    }

    getMatches_playedOut(){
        return this.md_matches.filter(match => !match.isUnplayed());
    }

    getMatches_unplayed(){
        return this.md_matches.filter(match => match.isUnplayed());
    }

    getNextUnplayedMatch(){
        return this.md_matches.find(match => match.isUnplayed());
    }

    getMatches_ofParticipant(participant){
        return this.md_matches.filter(match => match.md_participants.includes(participant));
    }

    setScoreValuesOfMatch(match, values){
        if(Number.isInteger(match)){
            match = this.getMatch_byMDid(match);
        }        
        match.setScoreValues(values);
    }


    /**
     * Add result of match to tournament results of individual participants of match
     * @param {MD_Match} match 
     */
    add_matchToResults(match){
        // if(!this.inner_class_match.canBeUsed(match)){
        //     throw InnerClassUnusable(this.inner_class_match.name);
        // }
        if (match.md_score.isEmpty()){ throw new NotSupportedAttributeValue("match.md_score", match.md_score.toString(), "Only played/filled match can be accounted");}
        
        this.transform_matchToParticipantsResults(match).forEach(match_result => {
                this.md_participants_results.find(pr =>
                    pr.md_participant === match_result.md_participant).md_result.add(
                        match_result.md_result);
        });
    }

    /**
     * Reset all participants result to default (template) value an fill them by all played matches from tournament list of matches
     */
    recount_allResults(){
        this.resetAllResults()
        this.getMatches_playedOut().forEach(match => {          
            this.add_matchToResults(match);
        });
    }

    /* todo: remove? */
    // computeResults_all(){
    //     this.participants.forEach(participant => {
    //         this.computeResult(participant);
    //     });
    // }    

    sortResults(sortFce=undefined){
        sortFce = sortFce || this.constructor.defaultSortResultFce;
        this.md_participants_results.sort((a,b) => {
            return sortFce(a.md_result, b.md_result);
        });
    }

    showCountedOrder(){
        console.log("Order:");
        let order = 1;
        this.md_participants_results.forEach(prt_rslt => {
            console.log(`\t${order}#\t${prt_rslt.toString()}`);
            order++;
        });
    }
}

module.exports = { 
    MD_ParticipantResult,
    MD_Competition
};



},{"../Core/MD_Errors":11,"../Core/MD_MatchGenerator":13,"./MD_MasterClass":2,"./MD_Match":3,"./MD_Match2Results":4,"./MD_Participant":5,"./MD_Result":7}],2:[function(require,module,exports){
const { MissingProperty } = require("../Core/MD_Errors");

class MD_MasterClass{
    static md_description = "Master class with properties and methods used by all others";
    static md_name = "MasterClass";

    #md_data;
    static data_check(data){
        /* throw Errro if data are not correct */
    }
    
    constructor(gg={}){
        if(gg === null){
            return null;
        }
        if(gg instanceof this.constructor){
            return gg;
        }

        //this.md_data = structuredClone(gg);
        this.md_data = gg;
    }

    copy(){
        return new this.constructor({...this.#md_data});
    }

    get md_data(){return this.#md_data;}
    set md_data(data){
        if(data instanceof this.constructor){ /* Setting one object to another */
            this.#md_data = data.md_data;
        }else{
            this.constructor.data_check(data);
            this.#md_data = data
        }
    };

    static preprocesJSON(parsedJSON, ...args){
        return parsedJSON;
    }

    static fromJSON(parsedJSON, ...args){
        return new this(this.preprocesJSON(parsedJSON, ...args));
    }

    // static fillInFrom(to, from){
    //     for(const key in this.md_template){
    //         if( key in from){
    //             to.key = from.key;
    //         }
    //     }
    // }

    // static resetToTemplate(obj, clear=false){
    //     if(clear){
    //         Object.keys(obj).forEach(key => delete obj[key]);
    //     }
    //     Object.assign(obj, this.md_template);
    // }

    // static canBeConstructedFrom(obj){
    //     for(const key in this.md_template){
    //         if( ! key in obj){
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // static listMissingProperties(obj){
    //     let missing = [];
    //     for(const key in this.md_template){
    //         if( ! key in obj){
    //             missing.push(key);
    //         }
    //     }
    //     return missing;
    // }

    // static propertyCheck(parsedJson){
    //     if(!this.canBeConstructedFrom(parsedJson)){
    //         throw MissingProperty(this.listMissingProperties(parsedJson), this.name)
    //     }
    // }

    // static toJSON(obj){
    //     return obj;
    // }
}

module.exports = {MD_MasterClass};
},{"../Core/MD_Errors":11}],3:[function(require,module,exports){
const { MD_MasterClass } = require("./MD_MasterClass");
const { MD_Score_Simple } = require("./MD_Score");
const { MD_Participant } = require("./MD_Participant");
const { IncorrectValues } = require("../Core/MD_Errors");

/**
 * Basic class for storing individual match
 * Each match has its participants and score
 * Extend class for adding another info like duration, place, start_time etc.
 * Do not forget fill in your desired inner_class_participant and inner_class_score
 *  eventualy md_name
 */
class MD_Match extends MD_MasterClass {
    static md_description = "Has its id, array of Participants and score.";
    static md_name = "Match";
    static innerClass_Score = MD_Score_Simple;
    static innerClass_Participant = MD_Participant;

    /* #data = {md_id:Number, md_participants:Array<innerClass_Participant>, md_score:innerClass_Score} */
    static data_check(data){
        if(!('md_id' in data)){
            throw new IncorrectValues(this.md_name, "md_id has to be set");
        }
        if(!('md_participants' in data)){
            throw new IncorrectValues(this.md_name, "md_participants has to be set");
        }
        if(!Array.isArray(data.md_participants)){
            throw new IncorrectValues(this.md_name, "md_participants has to be Array");
        }
        if(!('md_score' in data)){
            throw new IncorrectValues(this.md_name, "md_score has to be set");
        }
        if(data.md_score){
            this.innerClass_Score.data_check(data.md_score);
        }
        data.md_participants.forEach(prtcpnt => {
            this.innerClass_Participant.data_check(prtcpnt);
        });

    }

    constructor(gg/*={md_id:Number, md_participants: Array<innerClass_Participant>, md_score:innerClass_Score}*/){
        gg.md_score = gg.md_score || {md_values:[]};
        super(gg);
        this.md_participants = gg.md_participants; /* trigger setter */
        this.md_score = gg.md_score; /* trigger setter */
    }
    get md_id(){return this.md_data.md_id;}
    set md_id(id){this.md_data.md_id = id;}
    get md_participants(){return this.md_data.md_participants;}
    set md_participants(participants){
        if(!Array.isArray(participants)){
            throw new IncorrectValues(this.md_name, "participants has to be Array");
        }
        this.md_data.md_participants = participants.map(prtcpnt => {return new this.constructor.innerClass_Participant(prtcpnt)});
    }
    get md_score(){return this.md_data.md_score;}
    set md_score(score){
        this.md_data.md_score = new this.constructor.innerClass_Score(score);
    }

    toString(){
        return `${this.constructor.md_name} ${this.md_id}:\n\t${this.get_all_participants_string()}\n\t${this.md_score.toString()}`;
    }

    toJSON(){
        return {
            md_id: this.md_id,
            participants_md_ids: this.get_participants_MDids(),
            md_score: this.md_score.toJSON()
        };
    }

    static preprocesJSON(parsedJSON, participants_array){
        let participants = 
            parsedJSON.participants_md_ids.map((prtcpnt_id) => participants_array.find((prtcpnt) => prtcpnt.md_id === prtcpnt_id));
        
        return {
            md_id: parsedJSON.md_id,
            md_participants: participants,
            md_score: parsedJSON.md_score
        }
    }

    setScoreValues(values){
        this.md_score.md_values = values
    }

    isUnplayed(){
        return this.md_score.isEmpty();
    }

    get_participants_MDids(){
        return this.md_participants.map(participant => participant.md_id);
    }

    get_participants_names(){
        return this.md_participants.map(participant => participant.md_name);
    }

    get_all_participants_string(){
        return this.md_participants.map(prtcpnt => {return prtcpnt.toString()}).join(" x ");
    }
}

module.exports = {
    MD_Match
}
},{"../Core/MD_Errors":11,"./MD_MasterClass":2,"./MD_Participant":5,"./MD_Score":8}],4:[function(require,module,exports){
const { resolve_functions } = require('./MD_Resolve_functions');
const { MD_Result_Points } = require('./MD_Result');
const { MD_Score_Simple, MD_Score_Composite } = require('./MD_Score');

MD_Match2Results = {
    simpleScore2points(match){
        let given = resolve_functions.D1.GIVE_VALUES(match.md_score.md_values);
        let get = resolve_functions.D1.SUM_GET_VALUES(match.md_score.md_values);
        let res = [];
        for (let index = 0; index < given.length; index++) {
            res.push(new MD_Result_Points({given:given[index], get:get[index]}));            
        }
        return res;
    },
}


module.exports = {MD_Match2Results};
},{"./MD_Resolve_functions":6,"./MD_Result":7,"./MD_Score":8}],5:[function(require,module,exports){
const { MD_MasterClass } = require("./MD_MasterClass");
const { IncorrectValues } = require("../Core/MD_Errors");

/**
 * Basic class for tournament participant
 * -> extend it as you need
 */
class MD_Participant extends MD_MasterClass{
    static md_description = "Simple Participant with id and name only.";
    static md_name = "Participant";

    /* #data={md_id:Number, md_name:String} */
    static data_check(data){
        if(!('md_id' in data)){
            throw new IncorrectValues(this.md_name, "md_id has to be set");
        }
        if(!('md_name' in data)){
            throw new IncorrectValues(this.md_name, "md_name has to be set");
        }
    }

    // constructor(gg/*={md_id:Number, md_name:String}*/){
    //     super(gg);
    // }
    set md_id(id){this.md_data.md_id = id;}
    get md_id(){return this.md_data.md_id;}
    set md_name(name){this.md_data.md_name = name;}
    get md_name(){return this.md_data.md_name;}

    toString(){
        return `${this.constructor.md_name}: (${this.md_id}) ${this.md_name}`;
    }
    toJSON(){
        return {
            md_id: this.md_id,
            md_name: this.md_name
        }
    }
}

module.exports = {
    MD_Participant
}
},{"../Core/MD_Errors":11,"./MD_MasterClass":2}],6:[function(require,module,exports){
const {
    sumArray, 
    sumAllArrays, 
    markMaxAndOtherInArray 
} = require("../Core/MD_Helpers");

/**
 * Object used as parameter for functions determining winners and loosers.
 * @typedef {Object} MD_arg_WinerLooser
 * @property {number} winner_val - Value assigne to winner(s).
 * @property {number} draw_val - Value assigne to drawer(s).
 * @property {number} looser_val - Value assigne to looser(s).
 */

resolve_functions = {
    /* Functions processing 1D Array of values */
    D1:{
        /**
         * For every participant (index) return values that participant give
         * Only copy given values - exist for clearence of setting and also for not affecting stored score value when computing
         * @param {Array} values 
         * @returns {Array} Array with copy of original values
         */
        GIVE_VALUES(values){
            return [...values];
        },
        /**
         * For every participant (index) return sum of all others values (aka points that others give)
         * @param {Array} values 
         * @returns {Array} Array with sum of all values that oponents give
         */
        SUM_GET_VALUES(values){
            let sum = sumArray(values);
            return values.map((current) => sum-current);
        },

        /**
         * Find all participant (indexes) with maximum points and assigne winner value to it, to all others assigne looser value
         * @param {Array} values 
         * @param {MD_arg_WinerLooser} arg_obj
         * @returns {Array} Array with values assigned to each pariticipant (index) of original values
         */
        MARK_MAX_AND_OTHER(values, arg_obj={winner_val:1, looser_val:-1}){
            return markMaxAndOtherInArray(values, {max_mark:arg_obj.winner_val, other_mark:arg_obj.looser_val});
        } 
    },

    /* Functions processing 2D Array<Array> of values */
    D2:{
        /**
         * Element-wise sum of inner arrays 
         * @param {Array<Array>} values_es 
         * @returns {Array}
         */
        SUM(values_es){
            return sumAllArrays(values_es);
        }
    }
}

module.exports = {resolve_functions};
},{"../Core/MD_Helpers":12}],7:[function(require,module,exports){
const { MD_MasterClass } = require("./MD_MasterClass");
const { IncorrectValues } = require("../Core/MD_Errors");

class MD_Result_GivenGet extends MD_MasterClass {
    static md_description = "Two values: given, get";
    static md_name = "Given-Get";

    /* #data {given:_, get:_} */
    static data_check(data){
        if(!('given' in data)){
            throw new IncorrectValues(this.md_name, "given has to be set");
        }
        if(!('get' in data)){
            throw new IncorrectValues(this.md_name, "get has to be set");
        }
    }

    constructor(gg={given:0, get:0}){
        super(gg);
    }
    reset(gg={given:0, get:0}){
        this.given = gg.given;
        this.get = gg.get;
    }
    set given(points){this.md_data.given = points;}
    get given(){return this.md_data.given;}
    set get(points){this.md_data.get = points;}
    get get(){return this.md_data.get;}

    toString(){
        return `${this.constructor.md_name}: +${this.given}\u00A0-${this.get}\u00A0(${this.given-this.get})`;
    }
    toJSON(){
        return {
            given: this.given,
            get: this.get
        }
    }

    static sum(r1, r2){
        return new this.constructor(
            {
                given: r1.given + r2.given,
                get: r1.get + r2.get
            }
        );
    }

    add(other){
        this.given += other.given;
        this.get += other.get;
    }

    /**
     * compareFn for Array.prototype.sort
     */
    static sort_functions = {
        /**         
         * r1 before r2 if r1 give more than r2
         * @param {MD_Result_GivenGet} r1 
         * @param {MD_Result_GivenGet} r2 
         * @returns difference of only gived 
         */
        GIVE(r1, r2){
            return r2.given - r1.given;
        },

        /**
         * r1 before r2 if r1 get less than r2
         * @param {MD_Result_GivenGet} r1 
         * @param {MD_Result_GivenGet} r2 
         * @returns difference of only get 
         */
        GET(r1, r2){
            return r1.get - r2.get;
        },

        /**
         * r1 before r2 if r1 have smaller difference (give - get) than r2
         * @param {MD_Result_Points} r1 
         * @param {MD_Result_Points} r2 
         * @returns difference of (give - get) difference
         */
        DIFF(r1, r2){
            return (r2.given - r2.get) - 
                    (r1.given - r1.get);
        }
    }
}

class MD_Result_Points extends MD_Result_GivenGet {
    static md_description = "Two values: points given, points get";
    static md_name = "Points";
}

class MD_Result_Sets extends MD_Result_GivenGet {
    static md_description = "Two values: sets given, sets get";
    static md_name = "Sets";
}

/* Composition over inheritance pattern */
class MD_Result_Sets_Points extends MD_MasterClass {
    static md_description = "Four values: sets given, sets get, points given, points get";
    static md_name = `${MD_Result_Points.md_name}, ${MD_Result_Sets.md_name}`;
    static innerClassPoints = MD_Result_Points;
    static innerClassSets = MD_Result_Sets;

    /* #data = {points:innerClassPoints, sets:innerClassSets} */
    static data_check(data){
        if(!('points' in data)){
            throw new IncorrectValues(this.md_name, "points has to be set");
        }
        if(!('sets' in data)){
            throw new IncorrectValues(this.md_name, "sets has to be set");
        }

        this.innerClassPoints.data_check(data.points);
        this.innerClassSets.data_check(data.sets);
    }

    constructor(gg={points:{given:0, get:0}, sets:{given:0,get:0}}){
        super(gg);
        this.points = gg.points; /* trigger setter */
        this.sets = gg.sets; /* trigger setter */
    }
    reset(gg={points:{given:0, get:0}, sets:{given:0,get:0}}){
        this.points.reset(gg.points);
        this.sets.reset(gg.sets);
    }
    /* you can also (preferably) change values of for example points like this: result.points.give = 3 */
    get points(){return this.md_data.points;}
    set points(points){this.md_data.points = new this.constructor.innerClassPoints(points);}
    get sets(){return this.md_data.sets;}
    set sets(sets){this.md_data.sets = new this.constructor.innerClassSets(sets);}

    toString(){
        return `${this.sets.toString()} ${this.points.toString()}`;
    }
    toJSON(){
        return {
            points: this.points.toJSON(),
            sets: this.sets.toJSON()
        };
    }

    static sum(r1, r2){
        points_sum = this.innerClassPoints.sum(r1.points, r2.points);
        sets_sum = this.innerClassSets.sum(r1.sets, r2.sets);
        return new this.constructor({points:points_sum, sets:sets_sum});
    }

    add(other){
        this.points.add(other.points);
        this.sets.add(other.sets);
    }

    /**
     * compareFn for Array.prototype.sort
     */
    static sort_functions = {
        /**
         * r1 before r2 if:
         *  r1 sets difference > r2 sets difference
         *  r1 points difference > r2 points difference
         * @param {MD_Result_Sets_Points} r1 
         * @param {MD_Result_Sets_Points} r2 
         * @returns difference of (give - get) difference of sets, if equal return the same for points
         */
        DIFF_S_P(r1, r2){
            let res = MD_Result_GivenGet.sort_functions.DIFF(r1.sets, r2.sets);
            if (res === 0){
                res = MD_Result_GivenGet.sort_functions.DIFF(r1.points, r2.points);
            }
            return res;
        }
    }
}

module.exports = { 
    MD_Result_Points, 
    MD_Result_Sets, 
    MD_Result_Sets_Points 
};
},{"../Core/MD_Errors":11,"./MD_MasterClass":2}],8:[function(require,module,exports){
const { MD_MasterClass } = require("./MD_MasterClass");
const { InnerClassUnusable, IncorrectValues } = require("../Core/MD_Errors");

/**
 * Object used as parameter resolve() functions.
 * @typedef {Object} MD_arg_Resolve
 * @property {function} fce - Function used for resolving.
 * @property {Object} args - Object with arguments passed to fce - for example MD_arg_WinerLooser.
 */

/**
 * Basic class for storing simple one array score of values (typicaly Numbers)
 * You can fill in md_name property to name it
 */
class MD_Score_Simple extends MD_MasterClass {
    static md_description = "One value for every participant - {md_values:[3, 4, 5, ...]} or {md_values:[21,15]} etc.";
    static md_name = "Points";

    /* #md_data = {md_values:Array} */
    static data_check(data){
        if(!Array.isArray(data.md_values)){
            throw new IncorrectValues(this.md_name, "Values has to be Array");
        }
    }

    /**
     * 
     * @param {{md_values:Array}}} gg
     */
    constructor(gg={md_values:[]}){
        super(gg);
    }

    /**
     * @param {any[]} md_values
     */
    set md_values(values){
        this.constructor.data_check({md_values:values});
        this.md_data.md_values = [...values];
    }
    get md_values(){
        return this.md_data.md_values;
    }

    toString(){
        return `${this.constructor.md_name}: ${this.isEmpty() ? "_____" : this.md_values.join(" x ")}`;
    }

    toJSON(){
        return {
            md_values: this.md_values
        }
    }

    /**
     * Resolve given function and arguments on md_values
     * @param {MD_arg_Resolve} resolve_fces_and_args object with fce and args properties
     * Arranged as {fce: function, args: {...arguments for function}}
     * @returns {Array} should return, but depend on return of fce given as argument
     */
    resolve(resolve_fce_and_arg){
        return resolve_fce_and_arg.fce(this.md_values, resolve_fce_and_arg.args);
    }

    isEmpty(){
        return this.md_values.length === 0;
    }
}

/**
 * Class for storing score composed from other scores (like game from sets etc.)
 * Do not forget fill in your desired innerClass_Score
 *  eventualy md_name
 */
class MD_Score_Composite extends MD_MasterClass{
    static md_description = "Several lower level score - for example {md_values:[{md_values:[21,10]}, {md_values:[14,21]}, ...]";
    static md_name = "Set";
    static innerClass_Score = MD_Score_Simple;

    /* #md_data;  {md_values:Array<innerClass_Score>} */

    static data_check(data, check_inner=false){
        if(!Array.isArray(data.md_values)){
            throw new IncorrectValues(this.md_name, "Values has to be Array");
        }

        if(check_inner){
            data.md_values.forEach(inner => {
                this.innerClass_Score.data_check(inner);
            });
        }        
    }

    /**
     * 
     * @param {{md_values:Array<innerClass_Score>}} gg Array of inner_class to-construction md_values
     */
    constructor(gg={md_values:[]}){
        super(gg);
    }
    
    set md_values(values_es){
        this.constructor.data_check({md_values:values_es});
        this.md_data.md_values = [];
        values_es.forEach(vls => {
            this.addInner(vls)
        });
    }
    get md_values(){
        return this.md_data.md_values;
    }

    addInner(inner){
        if(!("md_values" in inner)){
            inner = {md_values: inner};
        }
        inner = new this.constructor.innerClass_Score(inner);
        this.md_values.push(inner);
    }

    toString(){
        let res = this.constructor.md_name;
        if (this.isEmpty()){ res += " _____";}
        else{
            this.md_values.forEach(inner => { /* todo using reduce() */
                res += `\n\t${inner}`;
            });

        }
        return res;
    }

    toJSON(){
        return {
            md_values: this.md_values.map(vls => vls.toJSON())
        }
    }

    /**
     * Function that recursively resolve inner score objects using provided functions and its arguments
     * @param {MD_arg_Resolve} resolve_fce_and_arg Functions and its arguments
     *  used for resolving inner scores. Arranged as {fce: function, args: {...arguments for function}}
     *  in order same as inner scores are - so last element should be function for resolving MD_Score_Simple
     * @param {Array<MD_arg_Resolve>]} inner_resolve_fces_and_args array of same structures as resolve_fce_and_arg
     *  in order same as inner scores are - so last element should be function for resolving MD_Score_Simple
     * @returns {Array} should return object with property md_values as Array, but depend on return of functions given as argument
     */
    resolve(resolve_fce_and_arg, inner_resolve_fces_and_args){
        let next = inner_resolve_fces_and_args[0];
        let remain = inner_resolve_fces_and_args.slice(1);

        let res_inner = [];
        this.md_values.forEach(val => {                    
            res_inner.push(val.resolve(next, remain));
        });

        return resolve_fce_and_arg.fce(res_inner, resolve_fce_and_arg.args);
    }

    isEmpty(){
        return this.md_values.length === 0;
    }
}

module.exports = { 
    MD_Score_Simple,
    MD_Score_Composite
};
},{"../Core/MD_Errors":11,"./MD_MasterClass":2}],9:[function(require,module,exports){
const {
    shortStringDate,
    minOfArray,
    maxOfArray
} = require('../Core/MD_Helpers');
const {
    weightsGenerator_Edmonds,
    POLICY_EDMOND_WEIGHTS,
    removeEdges
} = require('../Core/MD_WeightsGenerator');
const {
    resolve_functions
} = require('../Competition/MD_Resolve_functions');
const {
    MD_Participant
} = require('../Competition/MD_Participant');
const {
    MD_ParticipantResult,
    MD_Competition
} = require('../Competition/MD_Competition');
const {
    MD_Match
} = require('../Competition/MD_Match');
const { 
    one4each 
} = require('../Core/MD_MatchGenerator');
const { MD_Result_Sets_Points } = require('../Competition/MD_Result');
const { MD_Score_Composite, MD_Score_Simple } = require('../Competition/MD_Score');
const { IncorrectValues, UnexpectedCall } = require('../Core/MD_Errors');

class Participant_Radon extends MD_Participant{
    static md_description = "Participant with id, name, club and year of birth.";
    static md_name = "Hráč/ka";

    /* #data={
        md_id:Number, md_name:String,
        club:String, birth:Date
    } */
    static data_check(data){
        super.data_check(data);

        if(!('club' in data)){
            throw new IncorrectValues(this.md_name, "club has to be set");
        }
        if(!('birth' in data)){
            throw new IncorrectValues(this.md_name, "birth has to be set");
        }
    }
    constructor(gg/*={md_id:Number, md_name:String, club:String, birth:Date}*/){
        gg.birth = gg.birth instanceof Date ? gg.birth : new Date(gg.birth)
        super(gg);
    }

    get club(){return this.md_data.club;}
    set club(club){this.md_data.club = club;}
    get birth(){return this.md_data.birth;}
    set birth(date){this.md_data.birth = date;}


    toString(){
        return `${super.toString()} ${shortStringDate(this.birth)} ${this.club}`;
    }

    toJSON(){
        return {
            ...super.toJSON(),
            club : this.club,
            birth : shortStringDate(this.birth)
        };
    }

    static preprocesJSON(parsedJSON){
        return {
            ...super.preprocesJSON(parsedJSON),
            birth: new Date(parsedJSON.birth)
        };
    }
}

class ParticipantResult_Radon extends MD_ParticipantResult{
    static innerClassParticipant = Participant_Radon;
    static innerClassResult = MD_Result_Sets_Points;
}

class Score_Radon_Points extends MD_Score_Simple{
    static md_description = "Maximum je 15, např. [15,10], [14,15], ...";
    static md_name = "Míče";

    static data_check(data){
        super.data_check(data);

        let v0 = data.md_values[0], v1 = data.md_values[1];
        if (v0 > 15 || v1 > 15){
            throw new IncorrectValues(this.md_name, "Maximum míčů je 15");
        }

        if (v0 < 0 || v1 < 0){
            throw new IncorrectValues(this.md_name, "Minimum míčů je 0");
        }

        if ((v0 !== 15 && v1 !== 15) || (v0 === 15 && v1 === 15)){
            throw new IncorrectValues(this.md_name, "Právě jeden z hráčů musí mít 15 míčů");
        }
    }
}

class Score_Radon_Sets extends MD_Score_Composite{
    static description = "Dva hrané sety přesně.";
    static md_name = "Sety";
    static innerClass_Score = Score_Radon_Points;

    static data_check(data, check_inner=false){
        super.data_check(data, check_inner);
        if (data.md_values.length !== 0 && data.md_values.length !== 2){
            throw new IncorrectValues(this.md_name, "Sety musí být přesně dva");
        }
    }

    resolve_give_points(){
        return this.resolve(
            {
                fce: resolve_functions.D2.SUM,
                args: undefined
            },
            [
                {
                    fce: resolve_functions.D1.GIVE_VALUES,
                    args: undefined
                }
            ]
        )
    }

    resolve_get_points(){
        return this.resolve(
            {
                fce: resolve_functions.D2.SUM,
                args: undefined
            },
            [
                {
                    fce: resolve_functions.D1.SUM_GET_VALUES,
                    args: undefined
                }
            ]
        )
    }
    
    resolve_give_sets(){
        return this.resolve(
            {
                fce: resolve_functions.D2.SUM,
                args: undefined
            },
            [
                {
                    fce: resolve_functions.D1.MARK_MAX_AND_OTHER,
                    args: {winner_val:1, looser_val:0}
                }
            ]
        )
    }

    resolve_get_sets(){
        return this.resolve(
            {
                fce: resolve_functions.D2.SUM,
                args: undefined
            },
            [
                {
                    fce: resolve_functions.D1.MARK_MAX_AND_OTHER,
                    args: {winner_val:0, looser_val:1}
                }
            ]
        )
    }
}

class Match_Radon extends MD_Match{
    static md_name = "Zápas";
    static innerClass_Score = Score_Radon_Sets;
    static innerClass_Participant = Participant_Radon;
}

class Tournament_Swiss_Radon extends MD_Competition{
    static md_description = "Turnaj Švýcarským systémem na dva hrané sety do 15";
    static md_name = "Turnaj"
    static innerClassParticipantResult = ParticipantResult_Radon;
    static innerClassMatch = Match_Radon;
    static defaultSortResultFce = MD_Result_Sets_Points.sort_functions.DIFF_S_P;
    
    /* #data={md_id:Number, md_name:String, md_participants_results:Array<innerClassParticipantResult>, md_matches:Array<innerClassMatch>,
        date: Date, in_year_number: Number, number_of_played_round: Number
    } */
    static data_check(data){
        super.data_check(data);
        if(!('date' in data)){
            throw new IncorrectValues(this.md_name, "date has to be set");
        }
        if(!('in_year_number' in data)){
            throw new IncorrectValues(this.md_name, "in_year_number has to be set");
        }
        if(!('number_of_played_round' in data)){
            throw new IncorrectValues(this.md_name, "number_of_played_round has to be set");
        }
    }
    constructor(gg/*={md_id:Number, md_name_String, date:Date, in_year_number:Number*/){
        gg.date = gg.date || new Date();
        gg.in_year_number = gg.in_year_number || 1;
        gg.number_of_played_round = gg.number_of_played_round || 0;
        gg.overall_singletons = gg.overall_singletons || []; 
        super(gg);
    }
    get date(){return this.md_data.date;}
    set date(date){this.md_data.date = date;}
    get in_year_number(){return this.md_data.in_year_number;}
    set in_year_number(number){this.md_data.in_year_number = number;}
    get number_of_played_round(){return this.md_data.number_of_played_round;}
    set number_of_played_round(number){this.md_data.number_of_played_round = number;}
    get overall_singletons(){return this.md_data.overall_singletons;}
    set overall_singletons(singletons){this.md_data.overall_singletons = singletons;}

    addSingletons(singletons){
        this.overall_singletons.push(...singletons);
    }

    toJSON(){
        return {
            ...super.toJSON(),
            date: this.date,
            in_year_number: this.in_year_number,
            number_of_played_round: this.number_of_played_round,
            overall_singletons_md_id: this.overall_singletons.map(sngl => {return sngl.md_id;} )
        };
    }

    static preprocesJSON(parsedJSON){
        let super_json = super.preprocesJSON(parsedJSON);
        let overall_singletons = [];
        parsedJSON.overall_singletons_md_id.forEach(sngl_id => {
            overall_singletons.push(parsedJSON.md_participants_results.find(pr => sngl_id === pr.md_participant.md_id ).md_participant);
        })
        return {
            ...super_json,
            date: new Date(parsedJSON.date),
            in_year_number: parsedJSON.in_year_number,
            number_of_played_round: parsedJSON.number_of_played_round,            
            overall_singletons: overall_singletons
        };
    }

   /**
    * generate weights accounting actual stored order of results (participants) in Tournament
    * call sortResults() before this function if you want generate weights for sorted participants
    * @param {MD_arg_Draw} arg_obj 
    * @returns 
    */
    generate_weights(arg_obj/*={participants_to_draw, must_play_participants, same_club_penalty, weights_policy}*/){
        /* set tmp_id as index in array of results/participants */
        this.md_participants_results.forEach(pr => {
            pr.md_participant.tmp_id = -1; /* remove old values */
        });
        arg_obj.participants_to_draw.forEach((participant, index) => {
            participant.tmp_id = index; /* set actual values */
        });

        /* init */
        let weights = weightsGenerator_Edmonds(arg_obj.participants_to_draw.length, arg_obj.weights_policy);
        

        /* remove edges of already drawen match -> do not repeat already played matches */
        removeEdges(weights,
            this.md_matches.map(match => {return match.md_participants.map(p => p.tmp_id)})
        );

        /* decrease value of edges between participant from same club */
        if (arg_obj.same_club_penalty !== 0){
            let decreasing_value = arg_obj.same_club_penalty;
            weights.forEach(edge => {
                if(arg_obj.participants_to_draw[edge[0]].club === arg_obj.participants_to_draw[edge[1]].club){
                    edge[2] = edge[2]-decreasing_value;
                    //edge[2] = Math.max(edge[2]-decreasing_value, 0); /* no negative weights */
                    //edge[2] /= decreasing_value;
                }
            });
        }

        /* increase value of edges of must_play_participants -> no pause second time */
        /* or decrease value of edges of all others than must_play_participants -> look similar, but while matches are cross-players there is different behavior*/
        if(arg_obj.must_play_participants.length > 0){
            let wghts = weights.map(w => {return w[2]});
            let increasing_value = maxOfArray(wghts)-minOfArray(wghts)+1; /* higher weight than any other */
            let must_play_participants_tmp_ids = arg_obj.must_play_participants.map(p => p.tmp_id);
            weights.forEach(edge => {
                if(must_play_participants_tmp_ids.includes(edge[0]) || must_play_participants_tmp_ids.includes(edge[1]) ){
                //if(!must_play_participants_tmp_ids.includes(edge[0]) || !must_play_participants_tmp_ids.includes(edge[1]) ){
                        //edge[2] -= increasing_value;
                        edge[2] += increasing_value;                
                }
            });
        }
        return weights;
    }

    draw_inner(arg_obj/*={participants_to_draw = all_participants, must_play_participants:[], same_club_penalty:4, weights_policy:POLICY_EDMOND_WEIGHTS.E2E_SORTED_FRACTIONAL_LINEAR}*/){
        arg_obj = arg_obj || {}
        arg_obj.participants_to_draw = arg_obj.participants_to_draw || this.get_participants();
        arg_obj.must_play_participants = arg_obj.must_play_participants || [];
        arg_obj.same_club_penalty = arg_obj.same_club_penalty || 4;
        arg_obj.weights_policy = arg_obj.weights_policy || POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR_PLUS_FRACTIONAL_LINEAR;
        
        this.sortResults();

        let {matches, singletons} = one4each(arg_obj.participants_to_draw, this.generate_weights(arg_obj));
                     
        /* every draw match add to tournament matches */
        let first_id = this.md_matches.length+1;
        let draw_matches = [];
        matches.forEach((mtch, index) => {
            draw_matches.push(new this.constructor.innerClassMatch({
                md_id: first_id + index,
                md_participants: mtch
            }))            
        });
        this.md_matches.push(...draw_matches);
        console.log(`Přidán(y/o) ${draw_matches.length} zápas(y/ů) - metoda one4each`);

        return {draw_singletons: singletons, draw_matches: draw_matches};
    }

    draw(){
        const rounds_num = 6; /* must be even */
        let actual_round = this.number_of_played_round+1;
        if (this.getNextUnplayedMatch()){
            throw new UnexpectedCall("draw()", "Před nalosováním dalšího kola musí být odehrané všechny zápasy.");
        }

        if (actual_round > rounds_num+1 || 
            (actual_round == rounds_num+1 && this.overall_singletons.length === 0)){
            throw new UnexpectedCall("draw()", "Turnaj se hraje na 6 klasických kol a případně jedno kompenzační - ty již byly odehrány.");
        }

        let participants_to_draw, must_play_participants, same_club_penalty /* by this value will be divided value of edge, so 1 is no penalty */;
        if(actual_round <= rounds_num){ /* regular round */
            participants_to_draw = this.get_participants();
            must_play_participants = this.overall_singletons;
            if (actual_round <= rounds_num/2){
                same_club_penalty = participants_to_draw.length+1; /* no same club in first half */
            }else if(actual_round === rounds_num/2 + 1){
                same_club_penalty = 2;
            }else{ /* last two (on 6 rounds) with no penalty */
                same_club_penalty = 0; /* no penalty */
            }
        }else{ /* compensatory round */
            participants_to_draw = this.overall_singletons;
            must_play_participants = [];
            same_club_penalty = 1;
        }


        let res = this.draw_inner({
            participants_to_draw : participants_to_draw,
            must_play_participants : must_play_participants,
            same_club_penalty : same_club_penalty
        });
        
        this.number_of_played_round += 1;
        this.addSingletons(res.draw_singletons);

        return res;
    }

    match2results(match){
        let given_sets = match.md_score.resolve_give_sets();
        let get_sets = match.md_score.resolve_get_sets();
        let given_points = match.md_score.resolve_give_points();
        let get_points = match.md_score.resolve_get_points();
        let res = [];
        let result_class = this.constructor.innerClassParticipantResult.innerClassResult;
        for (let index = 0; index < given_sets.length; index++) {
            res.push(new result_class({
                points: {given: given_points[index], get: get_points[index]},
                sets: {given: given_sets[index], get: get_sets[index]}
            }));            
        }
        return res;
    }
}

module.exports = {
    Participant_Radon,
    Match_Radon,
    Tournament_Swiss_Radon };
},{"../Competition/MD_Competition":1,"../Competition/MD_Match":3,"../Competition/MD_Participant":5,"../Competition/MD_Resolve_functions":6,"../Competition/MD_Result":7,"../Competition/MD_Score":8,"../Core/MD_Errors":11,"../Core/MD_Helpers":12,"../Core/MD_MatchGenerator":13,"../Core/MD_WeightsGenerator":14}],10:[function(require,module,exports){

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

},{"./Retrieved/EdmondsBlossom.js":15}],11:[function(require,module,exports){
class NotSupportedAttributeValue extends Error{
    constructor(attr_name, attr_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotSupportedAttributeValue";
        this.message = message + ` Not support value ${attr_value} for ${attr_name}`;
    } 
}

class NotMatchArguments extends Error{
    constructor(attr1_name, attr1_value, attr2_name, attr2_value, message = "", ...args) {
        super(message, ...args);
        this.name = "NotMatchArguments";
        this.message = message + ` Atributes ${attr1_name} and ${attr2_name} do not match. Values: ${attr1_value} and ${attr2_value}`;
    } 
}

class NotOverridenFunction extends Error{
    constructor(function_name, base_class_name, message = "", ...args) {
        super(message, ...args);
        this.name = "NotOverridenFunction";
        this.message = message + ` Function ${function_name} from ${base_class_name} must be overriden - let it know to developer`;
    } 
}

class MissingProperty extends Error{
    constructor(property_name, usage_name, message = "", ...args) {
        super(message, ...args);
        this.name = "MissingProperty";
        this.message = message + ` Property ${property_name ? property_name : '<unspecified>'} missing for use in ${usage_name}`;
    } 
}

class InnerClassUnusable extends Error{
    constructor(innerClass_name, message = "", ...args) {
        super(message, ...args);
        this.name = "InnerClassUnusable";
        this.message = message + ` Cannot use ${innerClass_name} inside`;
    } 
}

class IncorrectValues extends Error{
    constructor(name, rule_description, message = "", ...args) {
        super(message, ...args);
        this.name = "IncorrectValues";
        this.message = message + ` In object ${name} violating: ${rule_description}`;
    } 
}

class UnexpectedCall extends Error{
    constructor(function_name, rule_description, message = "", ...args) {
        super(message, ...args);
        this.name = "UnexpectedCall";
        this.message = message + ` Unexpected call of ${function_name} violating: ${rule_description}`;
    } 
}

module.exports = {
    NotSupportedAttributeValue,
    NotMatchArguments,
    NotOverridenFunction,
    MissingProperty,
    InnerClassUnusable,
    IncorrectValues,
    UnexpectedCall
};
},{}],12:[function(require,module,exports){
const { NotMatchArguments } = require('./MD_Errors');

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
    let inner = outter > 0 ? ids[0].length : 0;
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

function maxOfArray(array){
    return array.reduce((a, b) => Math.max(a, b), -Infinity);
}

function minOfArray(array){
    return array.reduce((a, b) => Math.min(a, b), Infinity);
}

function showListOfObjects(message="", obj_list=[]){
    console.log(message)
    obj_list.forEach(obj => {
        console.log(`\t${obj.toString()}`);
    });
}

function sumArray(array){
    return array.reduce((partialSum, a) => partialSum + a, 0);
}

function appendToArray(to, from){
    if (to.length != from.length){
        throw NotMatchArguments("to.length", to.length, "from.length", from.length);
    }
    for (let index = 0; index < from.length; index++) {
        to[index] += from[index];        
    }
}

/**
 * 
 * @param {Array[Array]} arrays 2D array of sumable primitives 
 * @returns {Array} Element-wise sum
 */
function sumAllArrays(arrays){
    if (arrays.length < 1){
        return [];
    }
    let res = Array(arrays[0].length).fill(0);
    arrays.forEach(arr => appendToArray(res, arr)); 
    return res;
}

function markMaxAndOtherInArray(array, arg_obj={max_mark:1, other_mark:-1}){
    let max_indexes = indexesOfMaxInArray(array);
    let res = Array(array.length).fill(arg_obj.other_mark);
    max_indexes.forEach(idx => res[idx] = arg_obj.max_mark);
    return res;
}

function shortStringDate(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

module.exports = {
    ArrayTwodim,
    SetRange,
    selectOneDimFromListByIds,
    selectTwoDimFromListByIds,
    indexesOfMaxInArray,
    maxOfArray,
    minOfArray,
    showListOfObjects,
    sumArray,
    appendToArray,
    sumAllArrays,
    markMaxAndOtherInArray,
    shortStringDate
};
},{"./MD_Errors":11}],13:[function(require,module,exports){
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
},{"./MD_Algorithms":10,"./MD_Errors":11,"./MD_Helpers":12}],14:[function(require,module,exports){
const { combinations } = require('./MD_Algorithms');
const { NotSupportedAttributeValue } = require('./MD_Errors');

const POLICY_EDMOND_WEIGHTS = {
    E2E_EQUAL: 0, /* Every to every, each edge has same weights === 1 */
    /* Do not account distance of individuals in order */
    E2E_SORTED_LINEAR: 1, /* Every to every, weight is linear inverse of distance between indexes (max_distance - distance + 1) */
    /* 1. vs 4. and 2. vs 3. have same value as 1. vs 3. and 2. vs 4. -> wich is usually not good */
    E2E_SORTED_FRACTIONAL_LINEAR: 2, /* Every to every, weight is linear fraction of distance between indexes (1 / distance) */
    /* Here is hard to artificaly shift order of players for example with same club to greaterr distance
        Shift is easy, but is irregulary distributed throught higher places of order and luwer one
    */
   E2E_SORTED_LINEAR_PLUS_FRACTIONAL_LINEAR: 3, /* combine (sum) E2E_SORTED_LINEAR and E2E_SORTED_FRACTIONAL_LINEAR */
};

/**
 * Simple generator of weights/edges for one4each() function. Probably you will change some of values by your intention after usage of this function
 * @param {Int} num_individuals number of individuals (number of indexes for wich will be weights generated) 
 * @param {POLICY_EDMOND_WEIGHTS} policy policy for generating weights, see POLICY_EDMOND_WEIGHTS for description
 * @returns Array[NumberArray[3]] Array of edges in format [node_from, node_to, weight], node_from and node_to are indexes (starting from 0) of nodes, weight is wight of edge between this nodes
*/
function weightsGenerator_Edmonds(num_individuals, policy){
    let edges = [];
    if (num_individuals <= 0){return edges;}

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
        case POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR_PLUS_FRACTIONAL_LINEAR:
            let comb_lfl = combinations(num_individuals, 2);
            comb_lfl.forEach(nodes => {
                edges.push([...nodes, num_individuals - Math.abs(nodes[1] - nodes[0]) + 1/Math.abs(nodes[1] - nodes[0])]);
            });
            break;
        default:
          throw new NotSupportedAttributeValue("policy", policy, "use policy from POLICY_EDMOND_WEIGHTS")
    }
    return edges;
}

/**
 * 
 * @param {Array[NumberArray[3]]} weights probalbly returned from weightsGenerator_Edmonds
 * @param {Array[NumberArray[2]]} to_remove array of edges (Array[2]) with from_index and to_index
 */
function removeEdges(weights, to_remove){
    to_remove.forEach(tr => {
        let edge_index = weights.findIndex(w =>
            tr.includes(w[0]) && tr.includes(w[1]) /* only for two participant now */
            )
        if (edge_index !== -1){ /* match really found */
            weights.splice(edge_index, 1);
        }    
    });
}



module.exports = {
    POLICY_EDMOND_WEIGHTS,
    weightsGenerator_Edmonds,
    removeEdges
};
},{"./MD_Algorithms":10,"./MD_Errors":11}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
// const {
//     MD_Score_Simple,
//     MD_Score_Composite,
// } = require('./Competition/MD_Score');
// const {
//     MD_Result_Points,
//     MD_Result_Sets,
//     MD_Result_Sets_Points,
// } = require('./Competition/MD_Result');
const {
    Participant_Radon,
    Tournament_Swiss_Radon,
} = require('./Competition_Custom/Swiss_Radon');

console.log("See examples in showroom directory for usage example.");

module.exports = {
    Participant_Radon,
    Tournament_Swiss_Radon,
};
},{"./Competition_Custom/Swiss_Radon":9}]},{},[16])(16)
});
