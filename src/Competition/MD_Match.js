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