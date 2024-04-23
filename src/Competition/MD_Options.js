const { NotOverridenFunction } = require("../Core/MD_Errors");
const { sumArray, indexesOfMaxInArray } = require("../Core/MD_Helpers");

class MD_T_Result{
    static description = "Template for other Results.";
    constructor(){}
    incount(result){
        throw NotOverridenFunction("incount", "MD_Result");
    }   

    static sort_functions = {}
}

class MD_Result_Points extends MD_T_Result{
    static description = "Two values: points given, points get";
    /**
     * 
     * @param {Number} points_give 
     * @param {Number} points_get 
     */
    constructor(points_give = 0, points_get = 0){
        this.points_give = points_give;
        this.points_get = points_get; 
    }
    incount(result){
        this.points_give += result.points_give;
        this.points_get += result.points_get;
    }

    static sort_functions = {
        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if r1 give more points than r2
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of only gived points 
         */
        GIVE_P(r1, r2){
            return r2.points_give - r1.points_give;
        },

        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if r1 get less points than r2
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of only get points 
         */
        GET_P(r1, r2){
            return r1.points_get - r2.points_get;
        },

        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if r1 have smaller difference points (give - get) than r2
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of (give - get) difference of points
         */
        DIFF_P(r1, r2){
            return (r2.points_give - r2.points_get) - 
                    (r1.points_give - r1.points_get);
        }
    }
}

class MD_Result_Sets_Points extends MD_Result_Points{
    static description = "Four values: sets given, sets get, points given, points get";
    constructor(sets_give = 0, sets_get = 0, points_give = 0, points_get = 0){
        super(points_give, points_get);
        this.sets_give = sets_give;
        this.sets_get = sets_get;
    }
    incount(result){
        super.incount(result)
        this.sets_give += result.sets_give;
        this.sets_get += result.sets_get;
    }

    static sort_functions = {
        ...MD_Result_Points.sort_functions,

        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if r1 give more sets than r2
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of only gived sets 
         */
        GIVE_S(r1, r2){
            return r2.sets_give - r1.sets_give;
        },

        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if r1 get less sets than r2
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of only get sets 
         */
        GET_S(r1, r2){
            return r1.sets_get - r2.sets_get;
        },

        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if r1 have smaller difference sets (give - get) than r2
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of (give - get) difference of sets
         */
        DIFF_S(r1, r2){
            return (r2.sets_give - r2.sets_get) - 
                    (r1.sets_give - r1.sets_get);
        },

        /**
         * compareFn for Array.prototype.sort
         * r1 before r2 if:
         *  r1 sets difference > r2 sets difference
         *  r1 points difference > r2 points difference
         * @param {MD_T_Result} r1 
         * @param {MD_T_Result} r2 
         * @returns difference of (give - get) difference of sets
         */
        DIFF_S_P(r1, r2){
            let res = this.DIFF_S(r1, r2);
            if (res === 0){
                res = this.DIFF_P(r1, r2);
            }
            return res;
        }
    }
}

class MD_T_Score {
    static description = "Template for other Score";
    constructor(){}
    static toResult_functions = {}
}

class MD_Score_Points extends MD_T_Score {
    static description = "One Number value for every participant - [3, 4, 5, ...] or [21,15] etc.";
    /**
     * @param {Array[Number]} points for example [4,5] or [21, 14, 10, ...] for more participants 
     */
    constructor(points = []){
        this.points = points;
    }

    static resolve_functions = {
        COUNT_GET_POINTS(score){
            let sum = sumArray(score.points);
            return score.points.map((current) => sum-current);
        },

        MAX_WIN_OTHER_LOOSE(score){
            let winers_indexes = indexesOfMaxInArray(score.points);
            let res = Array(score.points.length).fill(-1);
            winers_indexes.forEach(idx => res[idx] = 1);
            return res;
        }
    }
}

class MD_Score_Sets extends MD_T_Score {
    static description = "Several sets with one Number value for every participant - [[21,15], [14,21], ...] or [[3,4,5,1, ...], [5,4,2,3,... ]] etc.";
    /**
     * @param {Array[MD_Score_Points]} sets in fact for example [[21,15], [14,21], ...] or [[3,4,5,1, ...], [5,4,2,3,... ]] for more participants 
     */
    constructor(sets = []){
        this.sets = sets;
    }
    static resolve_functions = {
        COUNT_GIVE_POINTS(score){
            let num = sets[0].points.length;
            let res = Array(num).fill(0);
            score.sets.forEach(set => {
                set.points.forEach((pnt, idx) => {
                    res[idx] += pnt;
                });
            });
            return res;
        },

        COUNT_GET_POINTS(score){
            let num = sets[0].points.length;
            let res = Array(num).fill(0);
            score.sets.forEach(set => {
                let set_res = MD_Score_Points.resolve_functions.COUNT_GET_POINTS(src);
                set_res.forEach((pnt, idx) => {
                    res[idx] += pnt;
                });
            });
            return res;
        }
    }
}

/**
 * template is template (like init) of result of participant - intended over whole turnament
 * sort_functions is rule how to compare two results in form of template. Will be used in sort() function
 */
const RESULT_TEMPLATES = {
    POINTS:
    {   template: {points: 0},
        add(to, from){
            to.points += from.points;
        },
        toString(){
            return `${this.points}`;
        },
        sort_functions: {
            /**
             * More points -> better placement
             */
            DESC(r1, r2){
                return r2.points - r1.points;
            }
        }        
    },
    
    SETS_POINTS_GIVE_GET:
    {   template: {sets: 0, points_give: 0, points_get: 0},
        add(to, from){
            to.sets += from.sets;
            to.points_give += from.points_give;
            to.points_get += from.points_get;
        },
        sort_functions: {
            /**
             * 1) More sets -> better placement
             * 2) Higher points_give - points_get -> better placement
             * TODO: Winner of mutual match - list througt matches for r1.participant
             * TODO: random
             */
            SETS_POINTS_DIFF(r1, r2){
                let res = r2.sets - r1.sets;
                if (res !== 0){ return res; }
                
                return (r2.points_give - r2.points_get) -
                    ((r1.points_give - r1.points_get));                
            }
        }
    },
}

module.exports = { RESULT_TEMPLATES };