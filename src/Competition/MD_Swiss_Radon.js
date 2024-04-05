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
    }

    toJSON(){
        let json = super.toJSON();
        json.club = this.club;
        json.birth_year = this.birth_year;

        return json;
    }

    static fromJSON(json) {
        return new Participant_Radon(
            json.md_id,
            json.md_name,
            json.club,
            json.birth_year);
    }

    toString(){
        return `${super.toString()} ${this.birth_year} ${this.club}`;
    }

    // toString_full(){
    //     return `${this.birth_year}, ${this.club}, ${super.toString()}`;
    // }
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

    toJSON(){
        let trnmnt = super.toJSON();
        trnmnt.date = this.date;
        trnmnt.in_year_number = this.in_year_number;
        trnmnt.number_of_played_round = this.number_of_played_round;
        return trnmnt;
    }

    /* some better approach than in-fact create 3 objects for 1 result? */
    static fromJSON(json) {
        let superObj = super.fromJSON(json, {participant: Participant_Radon, result: MD_Result, match: MD_Match});
        let trnmnt = new Tournament_Swiss_Radon(
            json.md_id,
            json.name,
            new Date(json.date),
            json.in_year_number,
            []
        );
        trnmnt.results = superObj.results;
        trnmnt.matches = superObj.matches;
        trnmnt.number_of_played_round = json.number_of_played_round;

        return trnmnt; 
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