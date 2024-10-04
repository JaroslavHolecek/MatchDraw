const { MissingProperty } = require("../Core/MD_Errors");

class MD_MasterClass{
    static md_description = "Master class with properties and methods used by all others";
    static md_name = "MasterClass";

    #md_data;
    static data_check(data, check_recursively=false){
        /* throw Error if data are not correct */
    }
    
    constructor(gg={}){
        if(gg === null){
            return null;
        }
        if(gg instanceof this.constructor){
            return gg;
        }

        //this.md_data = structuredClone(gg);
        this.md_data = gg; // see setter of md_data
    
        // /* you need not write trivial getter and setter for every property,
        //  but just for those, where something interisting will happen */
        // return new Proxy(this, {
        //     get: (target, prop) => {
        //         if (prop in target) {
        //             return target[prop];
        //         } else {
        //             return target.#md_data[prop];
        //         }
        //     },
        //     set: (target, prop, value) => {
        //         if (prop in target) {
        //             target[prop] = value;
        //         } else {
        //             target.#md_data[prop] = value;
        //         }
        //         return true;
        //     }
        // });
    }

    copy(){
        return new this.constructor({...this.#md_data});
    }

    get md_data(){return this.#md_data;}
    set md_data(data){
        if(data instanceof this.constructor){ /* Setting one object to another */
            this.#md_data = data.md_data;
        }else{
            this.constructor.data_check(data);
            this.#md_data = data
        }
    };

    static fromJSON(json, support){
        return this.fromObject(json, support);
    }

    /* override this functions in extending class */
    static fromObject(obj, support){
        this.data_check(obj, false);
        return new this(obj);
    }

    toJSON(){
        return this.md_data;
    }

    // static fillInFrom(to, from){
    //     for(const key in this.md_template){
    //         if( key in from){
    //             to.key = from.key;
    //         }
    //     }
    // }

    // static resetToTemplate(obj, clear=false){
    //     if(clear){
    //         Object.keys(obj).forEach(key => delete obj[key]);
    //     }
    //     Object.assign(obj, this.md_template);
    // }

    // static canBeConstructedFrom(obj){
    //     for(const key in this.md_template){
    //         if( ! key in obj){
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // static listMissingProperties(obj){
    //     let missing = [];
    //     for(const key in this.md_template){
    //         if( ! key in obj){
    //             missing.push(key);
    //         }
    //     }
    //     return missing;
    // }

    // static propertyCheck(parsedJson){
    //     if(!this.canBeConstructedFrom(parsedJson)){
    //         throw MissingProperty(this.listMissingProperties(parsedJson), this.name)
    //     }
    // }

    // static toJSON(obj){
    //     return obj;
    // }
}

module.exports = {MD_MasterClass};