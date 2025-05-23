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
    MD_Club
} = require('../Competition/MD_Club');
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
const { MD_Result_OneValue } = require('../Competition/MD_Result');
const { MD_Score_Composite, MD_Score_Simple } = require('../Competition/MD_Score');
const { IncorrectValues, UnexpectedCall } = require('../Core/MD_Errors');

class Participant_Elo_Radon extends MD_Participant{
    static md_description = "Participant with id, first name, second name, birthdate and club_id";
    static md_name = "Hráč/ka";

    /* #data={
        id:Number, name:String, second_name:String,
        club_id:Number, birth:Date
    } */
    static data_check(data){
        super.data_check(data);

        if(!('second_name' in data)){
            throw new IncorrectValues(this.md_name, "second_name has to be set");
        }
        if(!('club' in data)){
            throw new IncorrectValues(this.md_name, "club has to be set");
        }
        if(!('birth' in data)){
            throw new IncorrectValues(this.md_name, "birth has to be set");
        }
    }
    constructor(gg/*={md_id:Number, md_name:String, second_name:String, birth:Date, club:MD_Club}*/){
        gg.birth = gg.birth instanceof Date ? gg.birth : new Date(gg.birth)
        super(gg);
    }

    get second_name(){return this.md_data.second_name;}
    set second_name(second_name){this.md_data.second_name = second_name;}
    get birth(){return this.md_data.birth;}
    set birth(birth){this.md_data.birth = birth;}
    get club(){return this.md_data.club;}
    set club(club){this.md_data.club = club;}
    
    toString(){
        return `${super.toString()} ${this.second_name} ${shortStringDate(this.birth)} ${this.club.name}`;
    }

    toJSON(){
        return {
            ...super.toJSON(),
            second_name : this.second_name,
            club_id : this.club.id,
            birth : shortStringDate(this.birth)
        };
    }

    static fromObject(obj, support){
        this.data_check(obj);
        return new this({
            id: obj.id,
            name: obj.name,
            second_name: obj.second_name,
            birth: new Date(obj.birth),
            club: support.clubs_array.find(club => club.id === obj.club_id)
        });
    }
}

class Result_Elo extends MD_Result_OneValue{
    static md_description = "Elo hodnota";
    static md_name = "Elo";

    toString(){
        return `${this.constructor.md_name}: ${this.value.toFixed(2)}`;
    }
}

class ParticipantResult_Elo_Radon extends MD_ParticipantResult{
    static innerClassResult = Result_Elo;
}

class Score_Elo_Radon_Points extends MD_Score_Simple{
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

class Score_Elo_Radon_Sets extends MD_Score_Composite{
    static description = "Dva hrané sety přesně.";
    static md_name = "Sety";
    static innerClass_Score = Score_Elo_Radon_Points;

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
}

class Match_Elo_Radon extends MD_Match{
    static md_name = "Zápas";
    static innerClass_Score = Score_Elo_Radon_Sets;
    static innerClass_Participant = Participant_Elo_Radon;

    constructor(gg/*={id:Number, participants:Array<innerClass_Participant>, score:innerClass_Score}
                        elo_begin:Array<Number>*/){
        gg.elo_begin = gg.elo_begin || undefined;
        gg.round = gg.round || 0;
        super(gg);
    }

    get elo_begin(){return this.md_data.elo_begin;}
    set elo_begin(elo_begin){
        this.md_data.elo_begin = elo_begin ? [...elo_begin] : [];
    };

    toString(){
        let change_string = this.isUnplayed() ? "" : `-> změna o ${this.elo_change().map(chng => chng.toFixed(2)).join(" x ")}`;
        return `${super.toString()}\n\tElo: ${this.elo_begin.map(e => e.toFixed(2)).join(" x ")} ${change_string}`;
    }

    toJSON(){
        return {
            ...super.toJSON(),
            elo_begin: this.elo_begin,
        };
    }

    static fromObject(obj, participants_array) {
        // Call the fromObject method of the extended class
        const baseInstance = super.fromObject(obj, participants_array);

        // Add additional properties and return the new instance of the current class
        return new this({
            ...baseInstance.md_data,
            elo_begin: obj.elo_begin,
        });
    }

    expected_result_fraction(){
        let expected_0 = 1/(1+10**((this.elo_begin[1]-this.elo_begin[0])/400));
        let expected_1 = 1/(1+10**((this.elo_begin[0]-this.elo_begin[1])/400));
        return [expected_0, expected_1];
    }

    elo_change(){
        if(this.isUnplayed()){
            throw new UnexpectedCall("elo_change()", "Zápas musí být odehrán")
        }

        const max_points = 30;
        const denominator = 2*max_points; // for result value in interval <0,1>
        const expected_fractions = this.expected_result_fraction();
        
        let given_points = this.score.resolve_give_points();
        let get_points = this.score.resolve_get_points();
        
        const K = 30; /* koeficient of speed of elo-change (koeficient rozvoje K) */
        let elo_change = [];
        for (let player_index = 0; player_index < given_points.length; player_index++) {
            let result_fraction = (given_points[player_index]-get_points[player_index] + max_points)/denominator;
            elo_change.push(K*(result_fraction - expected_fractions[player_index]));
        }
        return elo_change;
    }
}

const PartitionsNames = Object.freeze({
    NONE:           'none', 
    ALL:            'all',  
    TOP_SMALL:      'top_small',
    TOP_LARGE:      'top_large',
    BOTTOM_SMALL:   'bottom_small',
    BOTTOM_LARGE:   'bottom_large',
    COMPENSATION:   'compensation',
});

class Partition{
    constructor(participants, round, fraction){
        this.participants = participants;
        this.singletons = [];
        this.matches = [];
        this.round = round;
        this.fraction = fraction;        
    }

    toJSON(){
        return {
            participants_id: this.participants.map(p => p.id),
            singletons_id: this.singletons.map(s => s.id),
            matches_id: this.matches.map(m => m.id),
            round: this.round,
            fraction: this.fraction
        };
    }

    static fromObject(obj, support={}){
        if (!Object.values(PartitionsNames).includes(obj.fraction)){
            throw new IncorrectValues("fraction", "Invalid value for fraction.");
        }
        this.fraction = obj.fraction;
        this.round = obj.round;
        this.participants = obj.participants_id.map(p_id => support.participants_array.find(p => p.id === p_id));    
        this.singletons = obj.singletons_id.map(s_id => support.participants_array.find(s => s.id === s_id));
        this.matches = obj.matches_id.map(m_id => support.matches_array.find(m => m.id === m_id));    
    }

}


class Tournament_Elo_Radon extends MD_Competition{
    static md_description = "Turnaj Švýcarským systémem na základě Elo hodnoty hráčů na dva hrané sety do 15";
    static md_name = "Turnaj"
    static innerClassParticipant = Participant_Elo_Radon;
    static innerClassParticipantResult = ParticipantResult_Elo_Radon;
    static innerClassMatch = Match_Elo_Radon;
    static innerClassClub = MD_Club;
    static defaultSortResultFce = Result_Elo.sort_functions.DECS;
    
    /* #data={id:Number, name:String, pariticipants:Array<innerClassParticipant> participants_results:Array<innerClassParticipantResult>, matches:Array<innerClassMatch>,
        clubs: Array<MD_Club>, date: Date, in_year_number: Number, number_of_played_round: Number
    } */
    static data_check(data, check_recursively=false){
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
        if(!('last_drawen_fraction' in data)){
            throw new IncorrectValues(this.md_last_drawen_fraction, "last_drawen_fraction has to be set");
        }
        // if(!('top_half_fraction' in data)){
        //     throw new IncorrectValues(this.md_top_half_fraction, "top_half_fraction has to be set");
        // }
        // if(!('bottom_half_fraction' in data)){
        //     throw new IncorrectValues(this.md_bottom_half_fraction, "bottom_half_fraction has to be set");
        // }
        // if(!('top_third_fraction' in data)){
        //     throw new IncorrectValues(this.md_top_third_fraction, "top_third_fraction has to be set");
        // }
        // if(!('mid_third_fraction' in data)){
        //     throw new IncorrectValues(this.md_mid_third_fraction, "mid_third_fraction has to be set");
        // }
        // if(!('bottom_third_fraction' in data)){
        //     throw new IncorrectValues(this.md_bottom_third_fraction, "bottom_third_fraction has to be set");
        // }
        // if(!('overall_singletons' in data)){
        //     throw new IncorrectValues(this.md_name, "overall_singletons has to be set");
        // }
        // if(!Array.isArray(data.overall_singletons)){
        //     throw new IncorrectValues(this.md_name, "overall_singletons has to be array");
        // }
        // if(!('not_draw_players' in data)){
        //     throw new IncorrectValues(this.md_name, "not_draw_players has to be set");
        // }
        // if(!Array.isArray(data.not_draw_players)){
        //     throw new IncorrectValues(this.md_name, "not_draw_players has to be array");
        // }
        if(!('clubs' in data)){
            throw new IncorrectValues(this.md_name, "clubs has to be set");
        }
        if(!Array.isArray(data.clubs)){
            throw new IncorrectValues(this.md_name, "clubs has to be array");
        }
        if(!('forrbiden_matches' in data)){
            throw new IncorrectValues(this.md_name, "forrbiden_matches has to be set");
        }
        if(!Array.isArray(data.forrbiden_matches)){
            throw new IncorrectValues(this.md_name, "forrbiden_matches has to be array");
        }

        if(check_recursively){
            data.clubs.forEach(club => {
                this.innerClassClub.data_check(club);
            });
        }
    }
    constructor(gg/*={md_id:Number, md_name_String, date:Date, in_year_number:Number*/){
        gg.date = gg.date || new Date();
        gg.in_year_number = gg.in_year_number || 1;
        gg.number_of_played_round = gg.number_of_played_round || 0;
        gg.overall_singletons = gg.overall_singletons || [];
        gg.clubs = gg.clubs || [];
        gg.not_draw_players = gg.not_draw_players || [];
        gg.forrbiden_matches = gg.forrbiden_matches || [];
        gg.partitions = gg.partitions || {
            '1_all': undefined,
            '2_top': undefined,
            '2_bottom': undefined,
            '3_top': undefined,
            '3_bottom': undefined,
            '4_top': undefined,
            '4_bottom': undefined,
            '5_top': undefined,
            '5_bottom': undefined,
            '6_top': undefined,
            '6_bottom': undefined,
            'compensation': undefined,
        };
        super(gg);
    }

    get date(){return this.md_data.date;}
    set date(date){this.md_data.date = date;}
    get in_year_number(){return this.md_data.in_year_number;}
    set in_year_number(in_year_number){this.md_data.in_year_number = in_year_number;}
    get number_of_played_round(){return this.md_data.number_of_played_round;}
    set number_of_played_round(number_of_played_round){this.md_data.number_of_played_round = number_of_played_round;}
    set overall_singletons(overall_singletons){this.md_data.overall_singletons = overall_singletons;}
    get overall_singletons(){return this.md_data.overall_singletons;}
    set not_draw_players(not_draw_players){this.md_data.not_draw_players = not_draw_players;}
    get not_draw_players(){return this.md_data.not_draw_players;}
    set forrbiden_matches(forrbiden_matches){this.md_data.forrbiden_matches = forrbiden_matches;}
    get forrbiden_matches(){return this.md_data.forrbiden_matches;}
    get partitions(){return this.md_data.partitions;}
    set partitions(partitions){this.md_data.partitions = partitions;}

    get clubs(){return this.md_data.clubs;}


    getParticipantsEloChanges_sorted(){
        const eloChanges = new Map();

        this.matches.forEach(match => {
            if (!match.isUnplayed()) {
                const change = match.elo_change()
                match.participants.forEach((participant, index) => {
                    const prtcpnt_change = change[index];
                    if (!eloChanges.has(participant.id)) {
                        eloChanges.set(participant.id, { participant, eloChange: 0 });
                    }
                    eloChanges.get(participant.id).eloChange += prtcpnt_change;
                });
            }
        });

        return Array.from(eloChanges.values())
            .sort((a, b) => b.eloChange - a.eloChange);
    } 
    
    addSingletons(singletons){
        this.overall_singletons.push(...singletons);
    }

    addNotDrawPlayer(player){
        this.not_draw_players.push(player);
    }

    addForbiddenMatch(match){
        this.forrbiden_matches.push(match);
    }

    toJSON(){
        return {
            ...super.toJSON(),
            date: this.date,
            in_year_number: this.in_year_number,
            number_of_played_round: this.number_of_played_round,
            last_drawen_fraction: this.last_drawen_fraction,
            top_half_fraction_id: this.top_half_fraction.map(plr => {return plr.id;} ),
            bottom_half_fraction_id: this.bottom_half_fraction.map(plr => {return plr.id;} ),
            top_third_fraction_id: this.top_third_fraction.map(plr => {return plr.id;} ),
            mid_third_fraction_id: this.mid_third_fraction.map(plr => {return plr.id;} ),
            bottom_third_fraction_id: this.bottom_third_fraction.map(plr => {return plr.id;} ),
            overall_singletons_id: this.overall_singletons.map(sngl => {return sngl.id;} ),
            clubs: this.md_data.clubs,
            not_draw_players_id: this.not_draw_players.map(p => {return p.id;}),
            forrbiden_matches: this.forrbiden_matches,
        };
    }

    static fromObject(obj, support={}){
        this.data_check(obj);
        obj.clubs = obj.clubs.map(club => {return this.innerClassClub.fromObject(club);});
        support.clubs_array = obj.clubs;
        
        let baseInstance = super.fromObject(obj, support);
        //let tmp_participants = baseInstance.participants;
        return new this({
            ...baseInstance.md_data,
            //participants: tmp_participants,
            date: new Date(obj.date),
            in_year_number: obj.in_year_number,
            number_of_played_round: obj.number_of_played_round,
            last_drawen_fraction: obj.last_drawen_fraction,
            top_half_fraction: obj.top_half_fraction_id.map(p_id => {return baseInstance.participants.find(pr => p_id === pr.id );}),
            bottom_half_fraction: obj.bottom_half_fraction_id.map(p_id => {return baseInstance.participants.find(pr => p_id === pr.id );}),
            top_third_fraction: obj.top_third_fraction_id.map(p_id => {return baseInstance.participants.find(pr => p_id === pr.id );}),
            mid_third_fraction: obj.mid_third_fraction_id.map(p_id => {return baseInstance.participants.find(pr => p_id === pr.id );}),
            bottom_third_fraction: obj.bottom_third_fraction_id.map(p_id => {return baseInstance.participants.find(pr => p_id === pr.id );}),
            overall_singletons: obj.overall_singletons_id.map(sngl_id => {return baseInstance.participants.find(pr => sngl_id === pr.id );}),
            clubs: obj.clubs,
            not_draw_players: obj.not_draw_players_id.map(p_id => {return baseInstance.participants.find(pr => p_id === pr.id );}),
            forrbiden_matches: obj.forrbiden_matches.map(mtch => this.innerClassMatch.fromObject(mtch, support))
        });
    }

    addClub(club){
        let tmp_club = new this.constructor.innerClassClub(club);
        this.clubs.push(tmp_club);
    }

   /**
    * generate weights accounting actual stored order of results (participants) in Tournament
    * call sortResults() before this function if you want generate weights for sorted participants
    * @param {MD_arg_Draw} arg_obj 
    * @returns 
    */
    generate_weights(arg_obj/*={participants_to_draw, must_play_participants, same_club_penalty, weights_policy}*/){
        /* set tmp_id as index in array of results/participants */
        this.participants_results.forEach(pr => {
            pr.participant.tmp_id = -1; /* remove old values */
        });
        arg_obj.participants_to_draw.forEach((participant, index) => {
            participant.tmp_id = index; /* set actual values */
        });

        /* init */
        let weights = weightsGenerator_Edmonds(arg_obj.participants_to_draw.length, arg_obj.weights_policy);
        

        /* remove edges of already drawen match -> do not repeat already played matches */
        removeEdges(weights,
            this.matches.map(match => {return match.participants.map(p => p.tmp_id)})
        );

        removeEdges(weights,
            this.forrbiden_matches.map(match => {return match.participants.map(p => p.tmp_id)})
        );

        /* decrease value of edges between participant from same club */
        if (arg_obj.same_club_penalty !== 0){
            let decreasing_value = arg_obj.same_club_penalty;
            weights.forEach(edge => {
                if(arg_obj.participants_to_draw[edge[0]].club === arg_obj.participants_to_draw[edge[1]].club){
                    edge[2] = edge[2]-decreasing_value;
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

    draw_inner(arg_obj/*={participants_to_draw = all_participants, must_play_participants:[], same_club_penalty:4, weights_policy:POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR_INVERSE_PLUS_FRACTIONAL_INVERSE}*/){
        arg_obj = arg_obj || {}
        arg_obj.participants_to_draw = arg_obj.participants_to_draw || this.get_participants_via_results();
        arg_obj.must_play_participants = arg_obj.must_play_participants || [];
        arg_obj.same_club_penalty = arg_obj.same_club_penalty || 4;
        arg_obj.weights_policy = arg_obj.weights_policy || POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR_INVERSE_PLUS_FRACTIONAL_INVERSE;

        let {matches, singletons} = one4each(arg_obj.participants_to_draw, this.generate_weights(arg_obj));
                     
        /* every draw match add to tournament matches */
        let first_id = maxOfArray(this.matches.map(match => match.id));
        if(!first_id || first_id < 0){
            first_id = 1;
        }else{ 
            first_id += 1;
        }
        let draw_matches = [];
        matches.forEach((mtch, index) => {
            draw_matches.push(new this.constructor.innerClassMatch({
                id: first_id + index,
                participants: mtch,
                elo_begin: mtch.map(p => this.participants_results.find(pr => pr.participant === p).result.value),
            }))            
        });
        this.matches.push(...draw_matches);
        console.log(`Přidán(y/o) ${draw_matches.length} zápas(y/ů) - metoda one4each`);

        return {draw_singletons: singletons, draw_matches: draw_matches};
    }

    find_and_remove_for_singletons(participants, number_to_find){
        if (number_to_find <= 0){
            return [];
        }

        if (number_to_find > participants.length){
            throw new IncorrectValues("number_to_find", "number_to_find must be less than or equal to the number of participants");
        }

        let excluded = [];
        for (let i = participants.length - 1; i >= 0; i--) { /* find participant from bottom of order */
            if (!this.overall_singletons.includes(participants[i])) { /* that is not already skip some round  */
                excluded = participants.splice(i, 1); /* return array of 1 elements */
                if (excluded.length === number_to_find){
                    break;
                }
            }
        }
    }

    remove_not_draw(participants){
        this.not_draw_players.forEach(prtcpnt => {
            participants.splice(participants.findIndex(p => p.id === prtcpnt.id), 1);
        });
    }

    draw_fractions(){
        /* move to next (now actual) round and fraction */
        const rounds_num = 6; /* must be even */     
        
        if (this.partitions['compensation'] !== undefined && /* compensation round exist */
            this.partitions['compensation'].matches.length > 0 /* already drawen */
            ||
            this.partitions['6_top'] !== undefined && /* last round exist */
            this.partitions['6_top'].matches.length > 0 && /* already drawen */
            this.overall_singletons.length === 0 /* no singletons */
        ) 
        {
            throw new UnexpectedCall("draw_fractions()", "Všechny části turnaje již byly nalosovány.");
        }
        
        let res;
        let participants_to_draw, excluded_participants=[];

        /* Prepare next partitions */
        let actual_fraction = undefined, actual_round = undefined; actual_partition_name = undefined;
        let number_in_top_half;
        if (this.partitions['1_all'] === undefined){
            actual_partition_name = '1_all';
            actual_fraction = PartitionsNames.ALL;
            actual_round = 1

            this.sortResults();

            participants_to_draw = this.get_participants_via_results(); /* all */
            this.remove_not_draw(participants_to_draw);

            /* odd number of participants */
            if (participants_to_draw.length % 2 !== 0){
                excluded_participants = this.find_and_remove_for_singletons(participants_to_draw, 3); /* 3 because you want 8 player for compensatory round, so no way they can play to each other already */
            }

            res = this.draw_inner({
                participants_to_draw : participants_to_draw,
                must_play_participants : [],
                same_club_penalty : participants_to_draw.length /* no same club match */
            });

            number_in_top_half = Math.floor(participants_to_draw.length/2);


        }else if (this.partitions['2_bottom'] === undefined){
            actual_fraction = PartitionsNames.BOTTOM_LARGE;
        }else if (this.partitions['2_top'] === undefined){
            actual_fraction = PartitionsNames.TOP_SMALL;
        }else if (this.partitions['3_bottom'] === undefined){
            actual_fraction = PartitionsNames.BOTTOM_SMALL;
        }else if (this.partitions['3_top'] === undefined){
            actual_fraction = PartitionsNames.TOP_LARGE;
        }else if (this.partitions['4_bottom'] === undefined){
            actual_fraction = PartitionsNames.BOTTOM_LARGE;
        }else if (this.partitions['4_top'] === undefined){
            actual_fraction = PartitionsNames.TOP_SMALL;
        }else if (this.partitions['5_bottom'] === undefined){
            actual_fraction = PartitionsNames.BOTTOM_SMALL;
        }else if (this.partitions['5_top'] === undefined){
            actual_fraction = PartitionsNames.TOP_LARGE;
        }else if (this.partitions['6_bottom'] === undefined){
            actual_fraction = PartitionsNames.BOTTOM_LARGE;
        }else if (this.partitions['6_top'] === undefined){
            actual_fraction = PartitionsNames.TOP_SMALL;
        }else if (this.partitions['compensation'] === undefined){
            actual_fraction = PartitionsNames.COMPENSATION;
        }else{
            throw new UnexpectedCall("draw_fraction()", "Unexpected state of partitions - should be aborted earlier.");
        }

        let prttn = new Partition(participants_to_draw, actual_round, actual_fraction);
        this.partitions[actual_partition_name] = prttn;

        prttn.singletons.push(...excluded_participants);
        this.addSingletons(excluded_participants); /* add to singleton(s) */

        prttn.matches.push(...res.draw_matches);
        
        


        
        if(actual_round <= rounds_num){
        /* regular round */
            participants_to_draw = this.get_participants_via_results();
            this.not_draw_players.forEach(prtcpnt => {
                participants_to_draw.splice(participants_to_draw.findIndex(p => p.id === prtcpnt.id), 1);
            });

            let number_in_top_half;
            /* select participants to draw now and prepare lists for next round  */
            switch(actual_fraction){
                case PartitionsNames.ALL:
                    /* preparation for next round */
                    number_in_top_half = Math.floor(participants_to_draw.length/2); 
                    if (number_in_top_half % 2 !== 0){ number_in_top_half+=1} /* top half is larger if odd number of participants in half (one more for even number) */
                    
                    this.top_half_fraction = participants_to_draw.slice().splice(0, number_in_top_half);
                    this.bottom_half_fraction = participants_to_draw.slice().splice(number_in_top_half);
                    
                    /* now */
                    /* no change in participants_to_draw */
                    break;
                
                case PartitionsNames.BOTTOM_HALF:
                    /* preparation for next round */
                    /* nothing */    
                    
                    /* now */
                    participants_to_draw = participants_to_draw.filter(p => this.bottom_half_fraction.includes(p));
                    break;

                case PartitionsNames.TOP_HALF:
                    /* preparation for next round */
                    let number_in_top_third = Math.floor(this.top_half_fraction.length/3);
                    if (number_in_top_third % 2 !== 0){ number_in_top_third+=1} /* top third is larger if odd number of participants in third (one more for even number) */

                    this.top_third_fraction = participants_to_draw.slice().splice(0, number_in_top_third);
                    this.mid_third_fraction = participants_to_draw.slice().splice(number_in_top_third, number_in_top_third);
                    this.bottom_third_fraction = participants_to_draw.slice().splice(2*number_in_top_third);
                    
                    /* now */
                    participants_to_draw = participants_to_draw.filter(p => this.top_half_fraction.includes(p));
                    break;

                case PartitionsNames.BOTTOM_THIRD:
                    /* preparation for next round */
                    /* nothing */

                    /* now */
                    participants_to_draw = participants_to_draw.filter(p => this.bottom_third_fraction.includes(p));
                    break;
                
                case PartitionsNames.MID_THIRD:
                    /* preparation for next round */
                    /* nothing */

                    /* now */
                    participants_to_draw = participants_to_draw.filter(p => this.mid_third_fraction.includes(p));
                    break;

                case PartitionsNames.TOP_THIRD:
                    /* preparation for next round */
                    number_in_top_half = Math.floor(participants_to_draw.length/2); 
                    if (number_in_top_half % 2 !== 0){ number_in_top_half+=1} /* top half is larger if odd number of participants in half (one more for even number) */
                    
                    this.top_half_fraction = participants_to_draw.slice().splice(0, number_in_top_half);
                    this.bottom_half_fraction = participants_to_draw.slice().splice(number_in_top_half);
                    
                    /* now */
                    participants_to_draw = participants_to_draw.filter(p => this.top_third_fraction.includes(p));
                    break;
            }

            

            // must_play_participants = this.overall_singletons; /* no needed when odd participant is already excluded */
            if (actual_round < rounds_num/2+1){ /* first half */
                same_club_penalty = participants_to_draw.length; /* no same club match */
            }else if(actual_round < rounds_num){ /* second half without last match */
                same_club_penalty = 5; /* shift of 5 places (jump over 4 participants) */
            }else{ /* last match */
                same_club_penalty = 0; /* no penalty */
            }
            
        }else{ 
        /* compensatory round */
            participants_to_draw = this.overall_singletons;
            same_club_penalty = 3; /* shift of 3 places (jump over 2 participant) */
        }

        // let res = this.draw_inner({
        //     participants_to_draw : participants_to_draw,
        //     must_play_participants : [],
        //     same_club_penalty : same_club_penalty
        // });
        // if (excluded_participant){
        //     res.draw_singletons.push(...excluded_participant);
        // }
        
        if(actual_fraction === PartitionsNames.ALL ||
            actual_fraction === PartitionsNames.TOP_HALF ||
            actual_fraction === PartitionsNames.TOP_THIRD)
        {
            this.number_of_played_round += 1;
        }
        // this.addSingletons(res.draw_singletons); /* no singletons when odd participant already excluded */

        return res;
    }

    has_unplayed_matches(participants){
        let unplayedMatches = this.getMatches_unplayed();
        participants.forEach(participant => {
            unplayedMatches.forEach(match => {
                if (match.participants.includes(participant)) {
                    return true;
                }
            });
        });
        return false;
    }

    draw(){ /* no fractions, no check*/
        const rounds_num = 6; /* must be even */
        let actual_round = this.number_of_played_round+1;
        // if (this.getNextUnplayedMatch()){
        //     throw new UnexpectedCall("draw()", "Před nalosováním dalšího kola musí být odehrané všechny zápasy.");
        // }

        if (actual_round > rounds_num+1 || 
            (actual_round == rounds_num+1 && this.overall_singletons.length === 0)){
            throw new UnexpectedCall("draw()", "Turnaj se hraje na 6 klasických kol a případně jedno kompenzační - ty již byly odehrány.");
        }

        this.sortResults();

        let participants_to_draw, excluded_participant=null, same_club_penalty /* this value will be subtracted of value of edge, so 0 is no penalty */;
        if(actual_round <= rounds_num){ /* regular round */
            participants_to_draw = this.get_participants_via_results();
            this.not_draw_players.forEach(prtcpnt => {
                participants_to_draw.splice(participants_to_draw.findIndex(p => p.id === prtcpnt.id), 1);
            });

            if (participants_to_draw.length % 2 !== 0){ /* odd number of participants */
                for (let i = participants_to_draw.length - 1; i >= 0; i--) { /* find participant from bottom of order */
                    if (!this.overall_singletons.includes(participants_to_draw[i])) { /* that is not already skip some round  */
                        excluded_participant = participants_to_draw.splice(i, 1); /* return array of 1 elements */
                        break;
                    }
                }
                this.addSingletons(excluded_participant); /* add to singleton(s) */
            }
            

            // must_play_participants = this.overall_singletons; /* no needed when odd participant is already excluded */
            if (actual_round < rounds_num/2+1){ /* first half */
                same_club_penalty = participants_to_draw.length; /* no same club match */
            }else if(actual_round < rounds_num){ /* second half without last match */
                same_club_penalty = 5; /* shift of 5 places (jump over 4 participants) */
            }else{ /* last match */
                same_club_penalty = 0; /* no penalty */
            }
        }else{ /* compensatory round */
            participants_to_draw = this.overall_singletons;
            same_club_penalty = 3; /* shift of 3 places (jump over 2 participant) */
        }

        let res = this.draw_inner({
            participants_to_draw : participants_to_draw,
            must_play_participants : [],
            same_club_penalty : same_club_penalty
        });
        if (excluded_participant){
            res.draw_singletons.push(...excluded_participant);
        }
        
        this.number_of_played_round += 1;
        // this.addSingletons(res.draw_singletons); /* no singletons when odd participant already excluded */

        return res;
    }


    draw_no_fraction(){ /* o fractions, but */
        const rounds_num = 6; /* must be even */
        let actual_round = this.number_of_played_round+1;
        if (this.getNextUnplayedMatch()){
            throw new UnexpectedCall("draw()", "Před nalosováním dalšího kola musí být odehrané všechny zápasy.");
        }

        if (actual_round > rounds_num+1 || 
            (actual_round == rounds_num+1 && this.overall_singletons.length === 0)){
            throw new UnexpectedCall("draw()", "Turnaj se hraje na 6 klasických kol a případně jedno kompenzační - ty již byly odehrány.");
        }

        this.sortResults();

        let participants_to_draw, excluded_participant=null, same_club_penalty /* this value will be subtracted of value of edge, so 0 is no penalty */;
        if(actual_round <= rounds_num){ /* regular round */
            participants_to_draw = this.get_participants_via_results();
            this.not_draw_players.forEach(prtcpnt => {
                participants_to_draw.splice(participants_to_draw.findIndex(p => p.id === prtcpnt.id), 1);
            });

            if (participants_to_draw.length % 2 !== 0){ /* odd number of participants */
                for (let i = participants_to_draw.length - 1; i >= 0; i--) { /* find participant from bottom of order */
                    if (!this.overall_singletons.includes(participants_to_draw[i])) { /* that is not already skip some round  */
                        excluded_participant = participants_to_draw.splice(i, 1); /* return array of 1 elements */
                        break;
                    }
                }
                this.addSingletons(excluded_participant); /* add to singleton(s) */
            }
            

            // must_play_participants = this.overall_singletons; /* no needed when odd participant is already excluded */
            if (actual_round < rounds_num/2+1){ /* first half */
                same_club_penalty = participants_to_draw.length; /* no same club match */
            }else if(actual_round < rounds_num){ /* second half without last match */
                same_club_penalty = 5; /* shift of 5 places (jump over 4 participants) */
            }else{ /* last match */
                same_club_penalty = 0; /* no penalty */
            }
        }else{ /* compensatory round */
            participants_to_draw = this.overall_singletons;
            same_club_penalty = 3; /* shift of 3 places (jump over 2 participant) */
        }

        let res = this.draw_inner({
            participants_to_draw : participants_to_draw,
            must_play_participants : [],
            same_club_penalty : same_club_penalty
        });
        if (excluded_participant){
            res.draw_singletons.push(...excluded_participant);
        }
        
        this.number_of_played_round += 1;
        // this.addSingletons(res.draw_singletons); /* no singletons when odd participant already excluded */

        return res;
    }

    match2results(match){
        let res = [];
        let result_class = this.constructor.innerClassParticipantResult.innerClassResult;
        match.elo_change().forEach((elo_chng) => {
            res.push(new result_class({
                value: elo_chng
            })); 
        });           
        return res;
    }
}

module.exports = {
    Participant_Elo_Radon,
    Match_Elo_Radon,
    Tournament_Elo_Radon
};