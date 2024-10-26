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
const {
    maxOfPropertyOfArray
} = require('../Core/MD_Helpers');

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
 * Participant can be any inner class - it is not checked here,
 * because Participant will be read from Participants list in tournament
 */
class MD_ParticipantResult extends MD_MasterClass {
    static md_description = "Hold connection between participant and its result."
    static md_name = "Participant's result";
    // change these in your extending class
    static innerClassResult = MD_Result_Points;

    /* data={participant:MD_Participant, result:innerClassResult} */
    static data_check(data, check_recursively=false){
        if(!('participant' in data)){
            throw new IncorrectValues(this.md_name, "participant has to be set");
        }
        if(!('result' in data)){
            throw new IncorrectValues(this.md_name, "result has to be set");
        }

        if(check_recursively){
            this.innerClassResult.data_check(data.result, check_recursively);
        }

    }

    // gg = {participant:MD_Participant, result:innerClassResult}
    constructor(gg){
        super(gg);
        this.participant = gg.participant;        
        this.result = gg.result        
    }

    set result(result){this.md_data.result = new this.constructor.innerClassResult(result);}
    get result(){return this.md_data.result;}

    toString(){
        return `${this.participant.toString()}\n\t${this.result.toString()}`;
    }

    // static fromJSON(json, participantsList)
    static fromObject(obj, support){
        return new this({
            participant: support.participants_array.find(p => p.id === obj.participant_id),
            result: this.innerClassResult.fromObject(obj.result, support)
        });
    }

    toJSON(){
        return {
            participant_id: this.participant.id,
            result: this.result.toJSON()
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
    // change these in your extending class
    static md_description = "Basic class for competition. Consist of id, name, participants with its results and matches.";
    static md_name = "Basic competition";
    static innerClassParticipant = MD_Participant;
    static innerClassParticipantResult = MD_ParticipantResult;
    static innerClassMatch = MD_Match;
    static defaultSortResultFce = MD_Result_Points.sort_functions.DIFF

    /* data={id:Number, name:String, participants:Array<innerClassParticipant>, participants_results:Array<innerClassParticipantResult>, matches:Array<innerClassMatch>} */
    static data_check(data, check_recursively=false){
        if(!('id' in data)){
            throw new IncorrectValues(this.md_name, "id has to be set");
        }
        if(!('name' in data)){
            throw new IncorrectValues(this.md_name, "name has to be set");
        }
        if(!('participants' in data)){
            throw new IncorrectValues(this.md_name, "participants has to be set");
        }
        if(!('participants_results' in data)){
            throw new IncorrectValues(this.md_name, "participants_results has to be set");
        }
        if(!Array.isArray(data.participants_results)){
            throw new IncorrectValues(this.md_name, "participants_results has to be Array");
        }
        if(!('matches' in data)){
            throw new IncorrectValues(this.md_name, "matches has to be set");
        }
        if(!Array.isArray(data.matches)){
            throw new IncorrectValues(this.md_name, "matches has to be Array");
        }

        if(check_recursively){
            data.participants.forEach(prtcpnt => {
                this.innerClassParticipant.data_check(prtcpnt, check_recursively);
            });

            data.participants_results.forEach(prtcpnt_rslt => {
                this.innerClassParticipantResult.data_check(prtcpnt_rslt, check_recursively);
            });

            data.matches.forEach(mtch => {
                this.innerClassMatch.data_check(mtch, check_recursively);
            });
        }
    }

    constructor(gg/*={id:Number, name"String}*/){
        gg.participants = gg.participants || [];
        gg.participants_results = gg.participants_results || [];
        gg.matches = gg.matches || [];
        super(gg);
    }

    get id(){return this.md_data.id;}
    set id(id){this.md_data.id = id;}
    get name(){return this.md_data.name;}
    set name(name){this.md_data.name = name;}
    get participants(){return this.md_data.participants;}

    set participants(participants){
        this.md_data.participants = participants.map(participant => new this.constructor.innerClassParticipant(participant));
    }

    get participants_results(){return this.md_data.participants_results;}
    set participants_results(participants_results){
        this.md_data.participants_results = participants_results.map(participant_result => new this.constructor.innerClassParticipantResult(participant_result));
    }

    get matches(){return this.md_data.matches;}
    set matches(matches){
        this.md_data.matches = matches.map(match => new this.constructor.innerClassMatch(match));
    }

    toJSON(){
        return {
            id: this.id,
            name: this.name,
            participants: this.participants.map(prtcpnt => prtcpnt.toJSON()),
            participants_results: this.participants_results.map(prt_rslt => prt_rslt.toJSON()),             
            matches: this.matches.map(mtch => mtch.toJSON()),
        };
    }

    static fromObject(obj, support={}){
        support.participants_array = obj.participants.map(prtcpnt => this.innerClassParticipant.fromObject(prtcpnt, support));
        return new this({
            id: obj.id,
            name: obj.name,
            participants: support.participants_array,
            participants_results: obj.participants_results.map(prt_rslt => this.innerClassParticipantResult.fromObject(prt_rslt, support)),
            matches: obj.matches.map(mtch => this.innerClassMatch.fromObject(mtch, support))
        });
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
        let {matches, singletons} = every2every(this.get_participants_via_results());
        let draw_matches = [];
        let first_id = maxOfPropertyOfArray(this.matches, "id") + 1;
        matches.forEach((mtch, index) => {
            draw_matches.push(new this.constructor.innerClassMatch({
                id: first_id + index,
                participants: mtch
            }))            
        });
        this.matches.push(...draw_matches);
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
                    participant: match.participants[index],
                    result: rslt
                }
            ));
        });
        return res; 
    }

    arrangeMatches(){
        console.log("In base-class function arrangeMatches() are matches left in same order they were added.");
    }

    addParticipant(participant){
        this.participants.push(participant);
    }

    addParticipantResult(participant, result=undefined){
        if(!participant instanceof this.constructor.innerClassParticipant){
            throw new IncorrectValues("participant", "participant has to be instance of innerClassParticipant");
        }

        if (result === undefined){
            result = new this.constructor.innerClassParticipantResult.innerClassResult();
        }
        if(!result instanceof this.constructor.innerClassParticipantResult.innerClassResult){
            throw new IncorrectValues("result", "result has to be instance of innerClassResult");
        }

        if (!this.participants.includes(participant)){
            this.addParticipant(participant);
        }

        this.participants_results.push(new this.constructor.innerClassParticipantResult({
            participant: participant,
            result: result
        }));
    }

    resetAllResults(){
        this.md_participants_results.forEach(prt_rslt => {
           prt_rslt.result.reset()});
    }

    getParticipantResult_byParticipantId(id){
        return this.participants_results.find(pr => pr.participant.id === id);
    }

    get_participants_via_results(){
        return this.participants_results.map(prt_rslt => prt_rslt.participant);
    }

    get_participants(){
        return this.participants;
    }

    get_participants_Ids(){
        return this.participants.map(prtcpnt => prtcpnt.id);
    }

    get_participants_names(){
        return this.participants.map(prtcpnt => prtcpnt.name);
    }

    addMatch(match){
        this.matches.push(new this.constructor.innerClassMatch(match));
    }

    getMatch_byId(id){
        return this.matches.find(m => m.id === id);
    }

    getMatches_playedOut(){
        return this.matches.filter(match => !match.isUnplayed());
    }

    getMatches_unplayed(){
        return this.matches.filter(match => match.isUnplayed());
    }

    getNextUnplayedMatch(){
        return this.matches.find(match => match.isUnplayed());
    }

    getMatches_ofParticipant(participant){
        return this.matches.filter(match => match.participants.includes(participant));
    }

    setScoreValuesOfMatch(match, values){
        if(Number.isInteger(match)){
            match = this.getMatch_byId(match);
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
        if (match.score.isEmpty()){ throw new NotSupportedAttributeValue("match.score", match.score.toString(), "Only played/filled match can be accounted");}
        
        this.transform_matchToParticipantsResults(match).forEach(match_result => {
                this.participants_results.find(pr =>
                    pr.participant === match_result.participant).result.add(
                        match_result.result);
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
        this.participants_results.sort((a,b) => {
            return sortFce(a.result, b.result);
        });
    }

    showCountedOrder(){
        console.log("Order:");
        let order = 1;
        this.participants_results.forEach(prt_rslt => {
            console.log(`\t${order}#\t${prt_rslt.toString()}`);
            order++;
        });
    }
}

module.exports = { 
    MD_ParticipantResult,
    MD_Competition
};


