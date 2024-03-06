const {
    indexesOfMaxInArray,
} = require('./MD_Helpers');

class MD_Participant{
    constructor(id){
        this.id = id;
        this.matches = [];
    }
};


const POLICY_RESULT_RESOLUTION = {
    MAX_1_OTHER_0: 0, /* Participant with maximum values of lower-level results get 1, others get 0 */
    SUM: 1, /* Every participants gets sumation of lower-level results  */
}

class MD_Result{
    constructor(subResults){
        this.subResults = subResults;
    }

    addSubResult(subResult){
        this.subResults.push(subResult);
    }

    resolve_lowest_level(policy){
        switch(policy){
            case POLICY_RESULT_RESOLUTION.MAX_1_OTHER_0:
                let resolution = Array(this.subResults.len).fill(0);                    
                indexesOfMaxInArray(this.subResults).forEach(index => {
                    resolution[index] = 1;
                });
                return resolution;

            case POLICY_RESULT_RESOLUTION.SUM:
                return this.subResults.copy();
        }
    }

    resolve(policy){

    }
};



class MD_Match{
    constructor(id, participants, result=null){
        this.id = id;
        this.participants = participants;
        this.result = result;
    }

    setResult(result){
        this.result = result;
    }
};




