const { NotOverridenFunction } = require('../Core/MD_Errors');

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
        this.matches = []; /* list of matches where this participate */
    }

    toJSON(){
        return {
            md_id: this.md_id,
            md_name: this.md_name,
            matches_md_ids: this.matches.map(match => match.md_id),
        };
    }

    toString(){
        return `${this.md_name} (${this.md_id})`;
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
        return `Match ${this.md_id}:\n\tParticipants: ${get_participants_names}\n\tScore: ${this.score}`;
    }

    get_participants_MDids(){
        return this.participants.map(participant => participant.md_id);
    }

    get_participants_names(){
        return this.participants.map(participant => participant.name);
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
}

/**
 * Basic class for tournament.
 * Tournament consist of participants and individual matches
 * Extend class for adding another info like place, date etc.
 */
class MD_Tournament{
    constructor(name, result_template, participants=[]){
        this.name = name;
        this.participants = participants;
        this.matches = [];
        this.results = [];
        this.result_template = result_template;

        this.initAllResults();
    }

    initResult(participant){
        this.results.push(new MD_Result(participant, this.result_template.copy()));
    }

    initAllResults(clear_current=false){
        if (clear_current) {this.results = [];}
        this.participants.forEach(participant => {
            this.initResult(participant);
        });
    }

    addParticipant(participant){
        this.participants.push(participant);
        this.initResult(participant)
    }

    get_participants_MDids(){
        return this.participants.map(participant => participant.md_id);
    }

    get_participants_names(){
        return this.participants.map(participant => participant.name);
    }

    addMatch(match){
        this.matches.push(match);
    }

    getMatches_playedOut(){
        return this.matches.filter(match => match.score !== null);
    }

    getMatches_unplayed(){
        return this.matches.filter(match => match.score === null);
    }

    setScoreOfMatch(match, score){
        if(match instanceof Int){
            match = this.matches.find(m => m.md_id === match);
        }        
        match.score = score;
    }

    draw(){
        throw new NotOverridenFunction('draw', 'MD_Tournament');
    }
}


// const POLICY_RESULT_RESOLUTION = {
//     MAX_1_OTHER_0: 0, /* Participant with maximum values of lower-level results get 1, others get 0 */
//     SUM: 1, /* Every participants gets sumation of lower-level results  */
// }

// resolve_lowest_level(policy){
//     switch(policy){
//         case POLICY_RESULT_RESOLUTION.MAX_1_OTHER_0:
//             let resolution = Array(this.subResults.len).fill(0);                    
//             indexesOfMaxInArray(this.subResults).forEach(index => {
//                 resolution[index] = 1;
//             });
//             return resolution;

//         case POLICY_RESULT_RESOLUTION.SUM:
//             return this.subResults.copy();
//     }
// }

// resolve(all_policies, level=0){
//     if(! this.subResults[0] instanceof MD_Result){
//         return this.resolve_lowest_level(all_policies[level]);
//     }
// }

