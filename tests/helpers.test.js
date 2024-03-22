const {
  POLICY_EDMOND_WEIGHTS,
  weightsGenerator_Edmonds,
  selectOneDimFromListByIds,
  selectTwoDimFromListByIds, } = require('../src/Core/MD_Helpers');

  const { NotMatchArguments } = require('../src/Core/MD_Errors');

describe('ArrayTwodim', () => {
  test('should create empty two dim array', () => {
      const outter = 1;
      const inner = 0;
      const expectedOutput = [[]];

      const output = ArrayTwodim(outter, inner);
      expect(output).toEqual(expectedOutput);
  });

  test('should create empty two dim array', () => {
    const outter = 2;
    const inner = 0;
    const expectedOutput = [[], []];

    const output = ArrayTwodim(outter, inner);
    expect(output).toEqual(expectedOutput);
});

});

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

describe('selectOneDimFromListByIds', () => {
  test('should select elements from list by given ids', () => {
      const list = [0, 10, 20, 30, 40, 50, 60, 70];
      const ids = [1, 3, 5, 6];
      const expectedOutput = [10, 30, 50, 60];

      const output = selectOneDimFromListByIds(list, ids);
      expect(output).toEqual(expectedOutput);
  });

  test('should return empty list when empty ids given', () => {
    const list = [0, 10, 20, 30, 40, 50, 60, 70];
    const ids = [];
    const expectedOutput = [];

    const output = selectOneDimFromListByIds(list, ids);
    expect(output).toEqual(expectedOutput);
  });

  test('should throw NotMatchArguments when large id given', () => {
    const list = [0, 10, 20, 30, 40, 50, 60, 70];
    const ids = [8];  

    expect(() => {
      selectOneDimFromListByIds(list, ids);
    }).toThrow(NotMatchArguments);
  });

  test('should throw NotMatchArguments when negative id given', () => {
    const list = [0, 10, 20, 30, 40, 50, 60, 70];
    const ids = [0, 1, 2, -1, 3, 4];  
    expect(() => {
      selectOneDimFromListByIds(list, ids);
    }).toThrow(NotMatchArguments);
  });
});

describe('selectTwoDimFromListByIds', () => {
  test('should select elements from list by given ids', () => {
      const list = [0, 10, 20, 30, 40, 50, 60, 70];
      const ids = [[1, 3, 2], [5, 6, 4]];
      const expectedOutput = [[10, 30, 20], [50, 60, 40]];

      const output = selectTwoDimFromListByIds(list, ids);
      expect(output).toEqual(expectedOutput);
  });

  test('should return empty list when empty ids given', () => {
    const list = [0, 10, 20, 30, 40, 50, 60, 70];
    const ids = [[]];
    const expectedOutput = [[]];

    const output = selectTwoDimFromListByIds(list, ids);
    expect(output).toEqual(expectedOutput);
  });

  test('should throw NotMatchArguments when large id given', () => {
    const list = [0, 10, 20, 30, 40, 50, 60, 70];
    const ids = [[8]];  

    expect(() => {
      selectTwoDimFromListByIds(list, ids);
    }).toThrow(NotMatchArguments);
  });

  test('should throw NotMatchArguments when negative id given', () => {
    const list = [0, 10, 20, 30, 40, 50, 60, 70];
    const ids = [[0, 1, 2], [-1, 3, 4]];  
    expect(() => {
      selectTwoDimFromListByIds(list, ids);
    }).toThrow(NotMatchArguments);
  });


// Add more tests as needed

});

