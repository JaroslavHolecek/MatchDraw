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


