const { one4each } = require('../Core/MD_MatchGenerator');


describe('one4each', () => {
    test('only two edges - matches', () => {
        const individuals = [0, 10,20,30,40,];
        const weights = [[0, 1, 1], [2, 3, 1]];
        const expectedOutput = [
            [ 0, 10 ],
            [ 20, 30 ],
          ];

        const output = one4each(individuals, weights).matches;
        expect(output).toEqual(expectedOutput);
    });

    test('only two edges - singletons', () => {
        const individuals = [0,10,20,30,40,];
        const weights = [[0, 1, 1], [2, 3, 1]];
        const expectedOutput = [40];

        const output = one4each(individuals, weights).singletons;
        expect(output).toEqual(expectedOutput);
    });

    test('only two edges, reference - matches', () => {
        const individuals = [
            {name: "Alice"},
            {name: "Bob"},
            {name: "Cecile"},
            {name: "David"},
            {name: "Eliska"},
        ];        
        const weights = [[0, 1, 1], [2, 3, 1]];
        const expectedOutput = [
            [ { name: 'Alice' }, { name: 'Bob' } ],
            [ { name: 'Cecile' }, { name: 'David' } ]
          ];

          const output = one4each(individuals, weights).matches;
          expect(output).toEqual(expectedOutput);
        
        expect(output).toEqual(expectedOutput);
        // Check if objects in the output are references to objects in the input list
        expect(output[0][0]).toBe(individuals[0]);
        expect(output[0][1]).toBe(individuals[1]);
        expect(output[1][0]).toBe(individuals[2]);
        expect(output[1][1]).toBe(individuals[3]);
    });

    test('only two edges, reference - singletons', () => {
        const individuals = [
            {name: "Alice"},
            {name: "Bob"},
            {name: "Cecile"},
            {name: "David"},
            {name: "Eliska"},
        ];        
        const weights = [[0, 1, 1], [2, 3, 1]];
        const expectedOutput = [ { name: 'Eliska' },];

          const output = one4each(individuals, weights).singletons;
          expect(output).toEqual(expectedOutput);
        
        expect(output).toEqual(expectedOutput);
        // Check if objects in the output are references to objects in the input list
        expect(output[0]).toBe(individuals[4]);
    });

    test('three edges - matches', () => {
        const individuals = [0,10,20,30,40,];
        const weights = [[0, 1, 1], [2, 3, 1], [3, 4, 0]];
        const expectedOutput = [
            [ 0, 10 ],
            [ 20, 30 ],
          ];

        const output = one4each(individuals, weights).matches;
        expect(output).toEqual(expectedOutput);
    });

    test('three edges - singletons', () => {
        const individuals = [0,10,20,30,40];
        const weights = [[0, 1, 1], [2, 3, 1], [3, 4, 0]];
        const expectedOutput = [40];

        const output = one4each(individuals, weights).singletons;
        expect(output).toEqual(expectedOutput);
    });

    test('three edges + nonedged - matches', () => {
        const individuals = [0,10,20,30,40,50];
        const weights = [[0, 1, 1], [2, 3, 1], [3, 4, 0]];
        const expectedOutput = [
            [ 0, 10 ],
            [ 20, 30 ],
          ];

        const output = one4each(individuals, weights).matches;
        expect(output).toEqual(expectedOutput);
    });

    test('three edges + nonedged - singletons', () => {
        const individuals = [0,10,20,30,40,50];
        const weights = [[0, 1, 1], [2, 3, 1], [3, 4, 0]];
        const expectedOutput = [40, 50];

        const output = one4each(individuals, weights).singletons;
        expect(output).toEqual(expectedOutput);
    });

    // Add more tests as needed
});
