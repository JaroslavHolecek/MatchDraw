const { combinations } = require('../Core/MD_Algorithms');

console.log(combinations);

describe('combinations', () => {
    test('should generate combinations of 3 elements from 5 total elements', () => {
        const n = 5;
        const k = 3;
        const expectedCombinations = [
            [1, 2, 3],
            [1, 2, 4],
            [1, 2, 5],
            [1, 3, 4],
            [1, 3, 5],
            [1, 4, 5],
            [2, 3, 4],
            [2, 3, 5],
            [2, 4, 5],
            [3, 4, 5]
        ];

        const gen_combinations = combinations(n, k);
        expect(gen_combinations).toEqual(expectedCombinations);
    });

    test('should generate combinations of 2 elements from 4 total elements', () => {
        const n = 4;
        const k = 2;
        const expectedCombinations = [
            [1, 2],
            [1, 3],
            [1, 4],
            [2, 3],
            [2, 4],
            [3, 4]
        ];

        const gen_combinations = combinations(n, k);
        expect(gen_combinations).toEqual(expectedCombinations);
    });

    test('should generate combinations of 1 element from 3 total elements', () => {
        const n = 3;
        const k = 1;
        const expectedCombinations = [
            [1],
            [2],
            [3]
        ];

        const gen_combinations = combinations(n, k);
        expect(gen_combinations).toEqual(expectedCombinations);
    });

    // Add more tests as needed
});
