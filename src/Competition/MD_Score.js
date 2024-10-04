const { MD_MasterClass } = require("./MD_MasterClass");
const { InnerClassUnusable, IncorrectValues } = require("../Core/MD_Errors");

/**
 * Object used as parameter resolve() functions.
 * @typedef {Object} MD_arg_Resolve
 * @property {function} fce - Function used for resolving.
 * @property {Object} args - Object with arguments passed to fce - for example MD_arg_WinerLooser.
 */

/**
 * Basic class for storing simple one array score of values (typicaly Numbers)
 * You can fill in md_name property to name it
 */
class MD_Score_Simple extends MD_MasterClass {
    static md_description = "One value for every participant - {md_values:[3, 4, 5, ...]} or {md_values:[21,15]} etc.";
    static md_name = "Points";

    /* #md_data = {md_values:Array} */
    static data_check(data){

        if(!('md_values' in data)){
            throw new IncorrectValues(this.md_name, "md_values has to be set");
        }
        if(!Array.isArray(data.md_values)){
            throw new IncorrectValues(this.md_name, "md_values has to be Array");
        }
    }

    /**
     * 
     * @param {{md_values:Array}}} gg
     */
    // constructor(gg={md_values:[]}){
    //     super(gg);
    // }

    /**
     * @param {any[]} md_values
     */
    set md_values(values){
        this.constructor.data_check({md_values:values});
        this.md_data.md_values = [...values];
    }
    get md_values(){
        return this.md_data.md_values;
    }

    toString(){
        return `${this.constructor.md_name}: ${this.isEmpty() ? "_____" : this.md_values.join(" x ")}`;
    }

    /**
     * Resolve given function and arguments on md_values
     * @param {MD_arg_Resolve} resolve_fces_and_args object with fce and args properties
     * Arranged as {fce: function, args: {...arguments for function}}
     * @returns {Array} should return, but depend on return of fce given as argument
     */
    resolve(resolve_fce_and_arg){
        return resolve_fce_and_arg.fce(this.md_values, resolve_fce_and_arg.args);
    }

    isEmpty(){
        return this.md_values.length === 0;
    }
}

/**
 * Class for storing score composed from other scores (like game from sets etc.)
 * Do not forget fill in your desired innerClass_Score
 *  eventualy md_name
 */
class MD_Score_Composite extends MD_MasterClass{
    static md_description = "Several lower level score - for example {md_values:[{md_values:[21,10]}, {md_values:[14,21]}, ...]";
    static md_name = "Set";
    static innerClass_Score = MD_Score_Simple;

    /* #md_data;  {md_values:Array<innerClass_Score>} */

    static data_check(data, check_inner=false){
        if(!('md_values' in data)){
            throw new IncorrectValues(this.md_name, "md_values has to be set");
        }
        if(!Array.isArray(data.md_values)){
            throw new IncorrectValues(this.md_name, "md_values has to be Array");
        }

        if(check_inner){
            data.md_values.forEach(inner => {
                this.innerClass_Score.data_check(inner);
            });
        }        
    }

    /**
     * 
     * @param {{md_values:Array<innerClass_Score>}} gg Array of inner_class to-construction md_values
     */
    constructor(gg={md_values:[]}){
        super(gg);
        this.md_values = gg.md_values; /* trigger setter */
    }
    
    set md_values(values_es){
        this.constructor.data_check({md_values:values_es});
        this.md_data.md_values = [];
        values_es.forEach(vls => {
            this.addInner(vls)
        });
    }
    get md_values(){
        return this.md_data.md_values;
    }

    addInner(inner){
        if(!("md_values" in inner)){
            inner = {md_values: inner};
        }
        inner = new this.constructor.innerClass_Score(inner);
        this.md_values.push(inner);
    }

    toString(){
        let res = this.constructor.md_name;
        if (this.isEmpty()){ res += " _____";}
        else{
            this.md_values.forEach(inner => { /* todo using reduce() */
                res += `\n\t${inner}`;
            });

        }
        return res;
    }

    toJSON(){
        return {
            md_values: this.md_values.map(vls => vls.toJSON())
        }
    }

    static fromObject(obj, support){
        this.data_check(obj, true);
        let gg = {md_values: []};
        obj.md_values.forEach(inner => {
            gg.md_values.push(this.innerClass_Score.fromObject(inner, support));
        });
        return new this(gg);
    }


    /**
     * Function that recursively resolve inner score objects using provided functions and its arguments
     * @param {MD_arg_Resolve} resolve_fce_and_arg Functions and its arguments
     *  used for resolving inner scores. Arranged as {fce: function, args: {...arguments for function}}
     *  in order same as inner scores are - so last element should be function for resolving MD_Score_Simple
     * @param {Array<MD_arg_Resolve>]} inner_resolve_fces_and_args array of same structures as resolve_fce_and_arg
     *  in order same as inner scores are - so last element should be function for resolving MD_Score_Simple
     * @returns {Array} should return object with property md_values as Array, but depend on return of functions given as argument
     */
    resolve(resolve_fce_and_arg, inner_resolve_fces_and_args){
        let next = inner_resolve_fces_and_args[0];
        let remain = inner_resolve_fces_and_args.slice(1);

        let res_inner = [];
        this.md_values.forEach(val => {                    
            res_inner.push(val.resolve(next, remain));
        });

        return resolve_fce_and_arg.fce(res_inner, resolve_fce_and_arg.args);
    }

    isEmpty(){
        return this.md_values.length === 0;
    }
}

module.exports = { 
    MD_Score_Simple,
    MD_Score_Composite
};