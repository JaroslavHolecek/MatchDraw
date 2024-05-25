const {
    sumArray, 
    sumAllArrays, 
    markMaxAndOtherInArray 
} = require("../Core/MD_Helpers");

/**
 * Object used as parameter for functions determining winners and loosers.
 * @typedef {Object} MD_arg_WinerLooser
 * @property {number} winner_val - Value assigne to winner(s).
 * @property {number} draw_val - Value assigne to drawer(s).
 * @property {number} looser_val - Value assigne to looser(s).
 */

resolve_functions = {
    /* Functions processing 1D Array of values */
    D1:{
        /**
         * For every participant (index) return values that participant give
         * Only copy given values - exist for clearence of setting and also for not affecting stored score value when computing
         * @param {Array} values 
         * @returns {Array} Array with copy of original values
         */
        GIVE_VALUES(values){
            return [...values];
        },
        /**
         * For every participant (index) return sum of all others values (aka points that others give)
         * @param {Array} values 
         * @returns {Array} Array with sum of all values that oponents give
         */
        SUM_GET_VALUES(values){
            let sum = sumArray(values);
            return values.map((current) => sum-current);
        },

        /**
         * Find all participant (indexes) with maximum points and assigne winner value to it, to all others assigne looser value
         * @param {Array} values 
         * @param {MD_arg_WinerLooser} arg_obj
         * @returns {Array} Array with values assigned to each pariticipant (index) of original values
         */
        MARK_MAX_AND_OTHER(values, arg_obj={winner_val:1, looser_val:-1}){
            return markMaxAndOtherInArray(values, {max_mark:arg_obj.winner_val, other_mark:arg_obj.looser_val});
        } 
    },

    /* Functions processing 2D Array<Array> of values */
    D2:{
        /**
         * Element-wise sum of inner arrays 
         * @param {Array<Array>} values_es 
         * @returns {Array}
         */
        SUM(values_es){
            return sumAllArrays(values_es);
        }
    }
}

module.exports = {resolve_functions};