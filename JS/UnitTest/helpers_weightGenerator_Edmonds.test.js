const { POLICY_EDMOND_WEIGHTS, weightsGenerator_Edmonds } = require('../Core/MD_Helpers');

describe('weightsGenerator_Edmonds', () => {
    test('E2E_EQUAL should generate every to every edges with weight 1 for all of them', () => {
        const input = 4;
        const input_policy = POLICY_EDMOND_WEIGHTS.E2E_EQUAL;
        const expectedOutput = [
            [ 0, 1, 1 ], [ 0, 2, 1 ], [ 0, 3, 1 ],
            [ 1, 2, 1 ], [ 1, 3, 1 ],
            [ 2, 3, 1 ],
          ];

        const output = weightsGenerator_Edmonds(input, input_policy);
        expect(output).toEqual(expectedOutput);
    });

    test('E2E_SORTED_LINEAR should generate every to every edges with weight 1 for mox_distance indexes and gradualy increased by 1 with decreasing distance', () => {
        const input = 4;
        const input_policy = POLICY_EDMOND_WEIGHTS.E2E_SORTED_LINEAR;
        const expectedOutput = [
            [ 0, 1, 3 ], [ 0, 2, 2 ], [ 0, 3, 1 ],
            [ 1, 2, 3 ], [ 1, 3, 2 ],
            [ 2, 3, 3 ],
          ];

        const output = weightsGenerator_Edmonds(input, input_policy);
        expect(output).toEqual(expectedOutput);
    });

    test('E2E_SORTED_FRACTIONAL_LINEAR should generate every to every edges with weight = 1/distance of indexes', () => {
        const input = 4;
        const input_policy = POLICY_EDMOND_WEIGHTS.E2E_SORTED_FRACTIONAL_LINEAR;
        const expectedOutput = [
            [ 0, 1, 1 ], [ 0, 2, 1/2 ], [ 0, 3, 1/3 ],
            [ 1, 2, 1 ], [ 1, 3, 1/2 ],
            [ 2, 3, 1 ],
          ];

        const output = weightsGenerator_Edmonds(input, input_policy);
        expect(output).toEqual(expectedOutput);
    });
    // Add more tests as needed

});
