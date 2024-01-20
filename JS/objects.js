const Enum = (keys) => {
    const obj = {};
    keys.forEach(key => {
        obj[key] = Symbol(key);
    });
    return Object.freeze(obj);
};

const MATCHES_POLICY_TYPE = Enum(["E2E_TABLE", "CUSTOME"]);

class MatchesPolicy{
    constructor(type){
        if (! type in MATCHES_POLICY_TYPE){
            throw new Error(`${t} is not valid MATCHES_POLICY_TYPE`);
        }
        this.type = type
    }

    generate_matches(){
        return [];
    }
}

class MatchesPolicy_E2E_TABLE extends MatchesPolicy{
    constructor(){
        super(MATCHES_POLICY_TYPE.E2E_TABLE);
    }

    generate_matches(ids){
        let matches = [];
        for (let i = 0; i < ids.length; i++) {
            for (let j = i+1; j < ids.length; j++) {
                matches.push([ids[i], ids[j]]);                
            }            
        }
        return matches;
    }
}

function generate_matches(ids, policy){

}

class Unit{
    constructor(id, value = 0){
        self.id = id;
        self.value = value;
    }
}

class Round{
    constructor(id, policy, units = []){
        self.id = id;
        self.units = units;
        self.policy = policy;
        self._matches = [];
    }

    /**
     * @param {POLICY_TYPE} p
     */
    set policy(p){
        if (! t instanceof Policy){
            throw new Error(`${t} is not valid Policy`);
        }
        self._policy = p;
    }
    get policy(){
        return self._policy;
    }

    get matches(){
        return self._matches;
    }

    generate_round_matches(){

    }
}

// Exporting the IndividualPlayer class and the comparePlayers function.
module.exports = {Enum, POLICY_TYPE, Policy, Policy_E2E_TABLE };
