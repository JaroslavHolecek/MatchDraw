const { MD_MasterClass } = require("./MD_MasterClass");
const { IncorrectValues } = require("../Core/MD_Errors");

/**
 * Basic class for club
 * -> extend it as you need
 */
class MD_Club extends MD_MasterClass{
    static md_description = "Simple Club with id and name only.";
    static md_name = "Club";

    /* data={id:Number, name:String} */
    static data_check(data, check_recursively=false){
        if(!('id' in data)){
            throw new IncorrectValues(this.md_name, "md_id has to be set");
        }
        if(!('name' in data)){
            throw new IncorrectValues(this.md_name, "md_name has to be set");
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
        return `${this.constructor.md_name}: (${this.id}) ${this.name}`;
    }
    toJSON(){
        return {
            id: this.id,
            name: this.name
        };
    }
}

module.exports = {
    MD_Club
}