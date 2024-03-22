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


