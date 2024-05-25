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