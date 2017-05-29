import tokenize from './tokenize';

describe('tokenize', () => {
  it('should parse strings correctly', () => {
    expect(Array.from(tokenize('1 + 5.5 * (6   - 3 / (2 + 3))   '))).toEqual([
      { type: 'number', value: 1 },
      { type: '+' },
      { type: 'number', value: 5.5 },
      { type: '*' },
      { type: '(' },
      { type: 'number', value: 6 },
      { type: '-' },
      { type: 'number', value: 3 },
      { type: '/' },
      { type: '(' },
      { type: 'number', value: 2 },
      { type: '+' },
      { type: 'number', value: 3 },
      { type: ')' },
      { type: ')' },
    ]);
  });
});
