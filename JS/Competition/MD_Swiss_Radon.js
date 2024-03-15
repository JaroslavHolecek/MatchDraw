const { indexesOfMaxInArray } = require('../Core/MD_Helpers');
const {
    MD_Tournament,
    MD_Participant,
    MD_Result, 
} = require('./Competition_base_classes');

const {
    RESULT_TEMPLATES,   
} = require('./Options');

const {
    indexesOfMaxInArray,
    weightsGenerator_Edmonds,
    POLICY_EDMOND_WEIGHTS,
} = require('../Core/MD_Helpers');
const { one4each } = require('../Core/MD_MatchGenerator');

class Participant_Radon extends MD_Participant{

    constructor(id, name, club, birth_year){
        super(id, name);
        this.club = club;
        this.birth_year = birth_year;
        this.tmp_id; /* temporary id - helper for draw / generating weights */
    }

    toJSON(){
        let json = super.toJSON();
        json.birth_year = this.birth_year;
        return json;
    }

    toString(){
        return `${this.birth_year} ${super.toString()}`;
    }
}

class Tournament_Swiss_Radon extends MD_Tournament{
    constructor(id, name, date, in_year_number, participants){
        super(id, name,
            RESULT_TEMPLATES.SETS_POINTS_GIVE_GET,
            RESULT_TEMPLATES.SETS_POINTS_GIVE_GET.SETS_POINTS_DIFF,
            participants );
        this.date = date;
        this.in_year_number = in_year_number;
    }

    count_matchToResult(match){
        /* score = [ [15,6] , [10,15] ] for example */ 

        match.participants.forEach((participant, index) => {
            let res = new MD_Result(participant, this.result_template.template.copy());
            match.result.forEach(set => {
                res.result.points_give += set[index];
                res.result.points_get += set.reduce((a, b) => a + b, 0) - set[index]; /* sum of all points minus given points */
                if (indexesOfMaxInArray(set).includes(index)) {
                    res.result.sets += 1;
                }
            });
        });
    }

    /* generate weights accounting actual stored order of results (participants) in Tournament
        call sortResults() before this function if you want generate weights for sorted participants
    */
    generate_weights(){
        /* set tmp_id as index in sorted array of results/participants */
        this.results.forEach((result, index) => {
            result.participant.tmp_id = index; 
        });
        /* init */
        let weights = weightsGenerator_Edmonds(this.results.length, POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR);
        
        /* remove edges of already drawen match */
        this.matches.forEach(match => {
            let participant_tmp_id = match.participants.map(participant => participant.tmp_id);
            weights.splice(weights.findIndex(w =>
                participant_tmp_id.includes(w[0]) && participant_tmp_id.includes(w[1])
                ), 1);
        });

        /* decrease value of edges between participant from same club */
        let decreasing_value = 3
        weights.forEach(edge => {
            if(this.results[edge[0]].participant.club === this.results[edge[1]].participant.club){
                edge[2] = Math.max(edge[2]-decreasing_value, 0); /* no negative weights */
            }
        });

        return weights;
    }

    draw(){
        this.sortResults();
        let {matches, singles} = one4each(this.results.map(r => r.participant),
                                          this.generate_weights());
        /* every Match add to matches */
    }
}