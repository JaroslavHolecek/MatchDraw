const { every2every } = require('../Core/MD_MatchGenerator');


describe('every2every', () => {
    test('should generate combinations of 2 elements from 5 total elements', () => {
        const input = [10,20,30,40,50,];
        const num = 2;
        const expectedOutput = [
            [ 10, 20 ], [ 10, 30 ], [ 10, 40 ], [ 10, 50 ],
            [ 20, 30 ], [ 20, 40 ], [ 20, 50 ],
            [ 30, 40 ], [ 30, 50 ],
            [ 40, 50 ],
          ];

        const output = every2every(input, num).matches;
        expect(output).toEqual(expectedOutput);
    });

    test('should generate combinations of 2 objects from 4 total objects', () => {
        const input = [
            {name: "Alice"},
            {name: "Bob"},
            {name: "Cecile"},
            {name: "David"},
        ];
        const num = 2;
        const expectedOutput = [
            [ { name: 'Alice' }, { name: 'Bob' } ],
            [ { name: 'Alice' }, { name: 'Cecile' } ],
            [ { name: 'Alice' }, { name: 'David' } ],
            [ { name: 'Bob' }, { name: 'Cecile' } ],
            [ { name: 'Bob' }, { name: 'David' } ],
            [ { name: 'Cecile' }, { name: 'David' } ]
          ];

        const output = every2every(input, num).matches;
        
        expect(output).toEqual(expectedOutput);
        // Check if objects in the output are references to objects in the input list
        expect(output[0][0]).toBe(input[0]);
        expect(output[3][0]).toBe(input[1]);
        expect(output[5][0]).toBe(input[2]);
        expect(output[5][1]).toBe(input[3]);
    });

    // Add more tests as needed
});
