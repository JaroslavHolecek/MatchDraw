const { MD_MasterClass } = require("./MD_MasterClass");
const { IncorrectValues } = require("../Core/MD_Errors");

/**
 * Basic class for tournament participant
 * -> extend it as you need
 */
class MD_Participant extends MD_MasterClass{
    static md_description = "Simple Participant with id and name only.";
    static md_name = "Participant";

    /* #data={md_id:Number, md_name:String} */
    static data_check(data){
        if(!('md_id' in data)){
            throw new IncorrectValues(this.md_name, "md_id has to be set");
        }
        if(!('md_name' in data)){
            throw new IncorrectValues(this.md_name, "md_name has to be set");
        }
    }

    // constructor(gg/*={md_id:Number, md_name:String}*/){
    //     super(gg);
    // }
    set md_id(id){this.md_data.md_id = id;}
    get md_id(){return this.md_data.md_id;}
    set md_name(name){this.md_data.md_name = name;}
    get md_name(){return this.md_data.md_name;}

    toString(){
        return `${this.constructor.md_name}: (${this.md_id}) ${this.md_name}`;
    }
    toJSON(){
        return {
            md_id: this.md_id,
            md_name: this.md_name
        }
    }
}

module.exports = {
    MD_Participant
}