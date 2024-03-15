
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
        sort_functions: {
            /**
             * More points -> better placement
             */
            DESC(){
                this.results.sort((r1, r2) => r2.result.points - r1.result.points);
            }
        }        
    },
    
    SETS_POINTS_GIVE_GET:
    {   template: {sets: 0, points_give: 0, points_get: 0},
        add(to, from){
            to.points += from.points;
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
            SETS_POINTS_DIFF(){
                this.results.sort((r1, r2) => {
                    let res = r2.result.sets - r1.result.sets;
                    if (res !== 0){ return res; }
                    
                    return (r2.result.points_give - r2.result.points_get) -
                        ((r1.result.points_give - r1.result.points_get));
                });
            }
        }
    },
}