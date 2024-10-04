const { MD_MasterClass } = require("./MD_MasterClass");
const { IncorrectValues } = require("../Core/MD_Errors");

/**
 * Basic class for tournament participant
 * -> extend it as you need
 */
class MD_Participant extends MD_MasterClass{
    // change these in your extending class
    static md_description = "Simple Participant with id and name only.";
    static md_name = "Participant";

    /* #data={md_id:Number, md_name:String} */
    static data_check(data){
        if(!('id' in data)){
            throw new IncorrectValues(this.md_name, "id has to be set");
        }
        if(!('name' in data)){
            throw new IncorrectValues(this.md_name, "name has to be set");
        }
    }

    // constructor(gg/*={id:Number, name:String}*/){
    //     super(gg);
    // }

    get id(){return this.md_data.id;}
    set id(id){this.md_data.id = id;}
    get name(){return this.md_data.name;}
    set name(name){this.md_data.name = name;}
    
  
    toString(){
        return `${this.constructor.name}: (${this.id}) ${this.name}`;
    }
}

module.exports = {
    MD_Participant
}