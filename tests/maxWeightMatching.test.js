const { maxWeightMatching } = require('../Core/MD_Algorithms');

describe('maxWeightMatching', () => {
    test('should return an empty array of edges for an empty graph', () => {
        const graph = [];
        const {matched_edges} = maxWeightMatching(graph);
        expect(matched_edges).toEqual([]);
    });

    test('should return an empty array of nodes for an empty graph', () => {
        const graph = [];
        const {nonmatched_nodes} = maxWeightMatching(graph);
        expect(nonmatched_nodes).toEqual([]);
    });

    test('should return an empty array of edges if one node', () => {
        const graph = [
            [0, 0, 1],  
        ];
        const {matched_edges} = maxWeightMatching(graph);
        expect(matched_edges).toEqual([]);
    });

    test('should return the array [0,] of node if one node', () => {
        const graph = [
            [0, 0, 1],  
        ];
        const {nonmatched_nodes} = maxWeightMatching(graph);
        expect(nonmatched_nodes).toEqual([0,]);
    });

    test('should return an array with edge if only one matching is possible', () => {
        const graph = [
            [0, 1, 10],
        ];
        const {matched_edges} = maxWeightMatching(graph);
        expect(matched_edges).toEqual([[0, 1]]);
    });

    test('should return an empty array if two nodes one edge', () => {
        const graph = [
            [0, 1, 10],  
        ];
        const {nonmatched_nodes} = maxWeightMatching(graph);
        expect(nonmatched_nodes).toEqual([]);
    });

    test('4 nodes to square, edges 2-2-2-0 ', () => {
        const graph = [
            [0, 1, 2],
            [1, 2, 2],
            [2, 3, 2],
        ];
        const {matched_edges, nonmatched_nodes} = maxWeightMatching(graph);
        expect(matched_edges).toEqual([[0, 1], [2, 3], ]);
        expect(nonmatched_nodes).toEqual([]);
    });

    test('4 nodes to square, edges 2-4-2-1', () => {
        const graph = [
            [0, 1, 2],
            [1, 2, 4],
            [2, 3, 2],
            [3, 0, 1],
        ];
        const {matched_edges, nonmatched_nodes} = maxWeightMatching(graph);
        expect(matched_edges).toEqual([[0, 3], [1, 2], ]);
        expect(nonmatched_nodes).toEqual([]);
    });

    test('5 nodes every to every, one node has low-weight edges', () => {
        const graph = [
            [0, 1, 1],
            [0, 2, 1],
            [0, 3, 0],
            [0, 4, 1],
            [1, 2, 1],
            [1, 3, 0],
            [1, 4, 1],
            [2, 3, 0],
            [2, 4, 1],
            [3, 4, 0],
        ];
        const {matched_edges, nonmatched_nodes} = maxWeightMatching(graph);
        expect(matched_edges.length).toEqual(2); /* TODO: create OR in testing... */
        expect(nonmatched_nodes).toEqual([3]);
    });

    // test('should return maximum weight matching for a non-empty graph', () => {
    //     const graph = [
    //         [0, 2, 1, 0],
    //         [2, 0, 0, 4],
    //         [1, 0, 0, 2],
    //         [0, 4, 2, 0]
    //     ];
    //     const matching = maxWeightMatching(graph);
    //     expect(matching).toEqual(expect.arrayContaining([[0, 2], [1, 3]]));
    // });

    

    // Add more test cases as needed
});
