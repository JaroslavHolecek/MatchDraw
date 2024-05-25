const { MD_MasterClass } = require("./MD_MasterClass");
const { IncorrectValues } = require("../Core/MD_Errors");

class MD_Result_GivenGet extends MD_MasterClass {
    static md_description = "Two values: given, get";
    static md_name = "Given-Get";

    /* #data {given:_, get:_} */
    static data_check(data){
        if(!('given' in data)){
            throw new IncorrectValues(this.md_name, "given has to be set");
        }
        if(!('get' in data)){
            throw new IncorrectValues(this.md_name, "get has to be set");
        }
    }

    constructor(gg={given:0, get:0}){
        super(gg);
    }
    reset(gg={given:0, get:0}){
        this.given = gg.given;
        this.get = gg.get;
    }
    set given(points){this.md_data.given = points;}
    get given(){return this.md_data.given;}
    set get(points){this.md_data.get = points;}
    get get(){return this.md_data.get;}

    toString(){
        return `${this.constructor.md_name}: +${this.given}\u00A0-${this.get}\u00A0(${this.given-this.get})`;
    }
    toJSON(){
        return {
            given: this.given,
            get: this.get
        }
    }

    static sum(r1, r2){
        return new this.constructor(
            {
                given: r1.given + r2.given,
                get: r1.get + r2.get
            }
        );
    }

    add(other){
        this.given += other.given;
        this.get += other.get;
    }

    /**
     * compareFn for Array.prototype.sort
     */
    static sort_functions = {
        /**         
         * r1 before r2 if r1 give more than r2
         * @param {MD_Result_GivenGet} r1 
         * @param {MD_Result_GivenGet} r2 
         * @returns difference of only gived 
         */
        GIVE(r1, r2){
            return r2.given - r1.given;
        },

        /**
         * r1 before r2 if r1 get less than r2
         * @param {MD_Result_GivenGet} r1 
         * @param {MD_Result_GivenGet} r2 
         * @returns difference of only get 
         */
        GET(r1, r2){
            return r1.get - r2.get;
        },

        /**
         * r1 before r2 if r1 have smaller difference (give - get) than r2
         * @param {MD_Result_Points} r1 
         * @param {MD_Result_Points} r2 
         * @returns difference of (give - get) difference
         */
        DIFF(r1, r2){
            return (r2.given - r2.get) - 
                    (r1.given - r1.get);
        }
    }
}

class MD_Result_Points extends MD_Result_GivenGet {
    static md_description = "Two values: points given, points get";
    static md_name = "Points";
}

class MD_Result_Sets extends MD_Result_GivenGet {
    static md_description = "Two values: sets given, sets get";
    static md_name = "Sets";
}

/* Composition over inheritance pattern */
class MD_Result_Sets_Points extends MD_MasterClass {
    static md_description = "Four values: sets given, sets get, points given, points get";
    static md_name = `${MD_Result_Points.md_name}, ${MD_Result_Sets.md_name}`;
    static innerClassPoints = MD_Result_Points;
    static innerClassSets = MD_Result_Sets;

    /* #data = {points:innerClassPoints, sets:innerClassSets} */
    static data_check(data){
        if(!('points' in data)){
            throw new IncorrectValues(this.md_name, "points has to be set");
        }
        if(!('sets' in data)){
            throw new IncorrectValues(this.md_name, "sets has to be set");
        }

        this.innerClassPoints.data_check(data.points);
        this.innerClassSets.data_check(data.sets);
    }

    constructor(gg={points:{given:0, get:0}, sets:{given:0,get:0}}){
        super(gg);
        this.points = gg.points; /* trigger setter */
        this.sets = gg.sets; /* trigger setter */
    }
    reset(gg={points:{given:0, get:0}, sets:{given:0,get:0}}){
        this.points.reset(gg.points);
        this.sets.reset(gg.sets);
    }
    /* you can also (preferably) change values of for example points like this: result.points.give = 3 */
    get points(){return this.md_data.points;}
    set points(points){this.md_data.points = new this.constructor.innerClassPoints(points);}
    get sets(){return this.md_data.sets;}
    set sets(sets){this.md_data.sets = new this.constructor.innerClassSets(sets);}

    toString(){
        return `${this.sets.toString()} ${this.points.toString()}`;
    }
    toJSON(){
        return {
            points: this.points.toJSON(),
            sets: this.sets.toJSON()
        };
    }

    static sum(r1, r2){
        points_sum = this.innerClassPoints.sum(r1.points, r2.points);
        sets_sum = this.innerClassSets.sum(r1.sets, r2.sets);
        return new this.constructor({points:points_sum, sets:sets_sum});
    }

    add(other){
        this.points.add(other.points);
        this.sets.add(other.sets);
    }

    /**
     * compareFn for Array.prototype.sort
     */
    static sort_functions = {
        /**
         * r1 before r2 if:
         *  r1 sets difference > r2 sets difference
         *  r1 points difference > r2 points difference
         * @param {MD_Result_Sets_Points} r1 
         * @param {MD_Result_Sets_Points} r2 
         * @returns difference of (give - get) difference of sets, if equal return the same for points
         */
        DIFF_S_P(r1, r2){
            let res = MD_Result_GivenGet.sort_functions.DIFF(r1.sets, r2.sets);
            if (res === 0){
                res = MD_Result_GivenGet.sort_functions.DIFF(r1.points, r2.points);
            }
            return res;
        }
    }
}

module.exports = { 
    MD_Result_Points, 
    MD_Result_Sets, 
    MD_Result_Sets_Points 
};