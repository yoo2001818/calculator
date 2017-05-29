import shuntingYard from './shuntingYard';
import tokenize from './tokenize';

describe('shuntingYard', () => {
  it('should parse strings correctly', () => {
    expect(shuntingYard(tokenize('1 + 3 * 2 + max(2 + 2)'))).toEqual([
      { type: 'number', value: 1 },
      { type: 'number', value: 3 },
      { type: 'number', value: 2 },
      { type: '*' },
      { type: '+' },
      { type: 'number', value: 2 },
      { type: 'number', value: 2 },
      { type: '+' },
      { type: 'keyword', value: 'max' },
      { type: '+' },
    ]);
  });
});
