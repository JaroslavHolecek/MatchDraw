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
    // change these in your extending class
    static md_description = "Has its id, array of Participants and score.";
    static md_name = "Match";
    static innerClass_Score = MD_Score_Simple;
    static innerClass_Participant = MD_Participant;

    /* #data = {id:Number, participants:Array<innerClass_Participant>, score:innerClass_Score} */
    static data_check(data, check_recursively=false){
        if(!('id' in data)){
            throw new IncorrectValues(this.md_name, "id has to be set");
        }
        if(!('participants' in data)){
            throw new IncorrectValues(this.md_name, "participants has to be set");
        }
        if(!Array.isArray(data.participants)){
            throw new IncorrectValues(this.md_name, "participants has to be Array");
        }
        if(!('score' in data)){
            throw new IncorrectValues(this.md_name, "score has to be set");
        }

        if(check_recursively){
            if(data.score){
                this.innerClass_Score.data_check(data.score, check_recursively);
            }
            data.participants.forEach(prtcpnt => {
                this.innerClass_Participant.data_check(prtcpnt, check_recursively);
            });
        }
    }

    constructor(gg/*={id:Number, participants: Array<innerClass_Participant>, score:innerClass_Score}*/){
        gg.score = gg.score || {md_values:[]};
        super(gg);
        this.participants = gg.participants; /* trigger setter */
        this.score = gg.score; /* trigger setter */
    }

    get id(){return this.md_data.id;}
    set id(id){this.md_data.id = id;}
    get participants(){return this.md_data.participants;}
    set participants(participants){
        this.md_data.participants = participants.map(participant => new this.constructor.innerClass_Participant(participant));
    }
    get score() {return this.md_data.score;}    
    set score(score){
        this.md_data.score = new this.constructor.innerClass_Score(score);
    }
    

    toString(){
        return `${this.constructor.md_name} ${this.id}:\n\t${this.get_all_participants_string()}\n\t${this.score.toString()}`;
    }

    toJSON(){
        return {
            id: this.id,
            participants_ids: this.get_participants_ids(),
            score: this.score.toJSON()
        };
    }

    static fromObject(obj, support){
        obj.participants = obj.participants_ids.map((prtcpnt_id) => support.participants_array.find((prtcpnt) => prtcpnt.id === prtcpnt_id));
        this.data_check(obj, true);
        return new this({
            id: obj.id,
            participants: obj.participants,
            score: new this.innerClass_Score(obj.score)
        });
    }

    setScoreValues(values){
        this.score.md_values = values
    }

    isUnplayed(){
        return this.score.isEmpty();
    }

    get_participants_ids(){
        return this.participants.map(participant => participant.id);
    }

    get_participants_names(){
        return this.participants.map(participant => participant.name);
    }

    get_all_participants_string(){
        return this.participants.map(prtcpnt => {return prtcpnt.toString()}).join(" x ");
    }
}

module.exports = {
    MD_Match
}