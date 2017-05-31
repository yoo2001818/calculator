import naive from './naive';
import tokenize from './tokenize';

describe('naive', () => {
  it('should parse strings correctly', () => {
    expect(naive(tokenize('1 + 3 * 2 * 3 + 5 * 3 + 5'))).toEqual([
      { type: 'number', value: 1 },
      { type: 'number', value: 3 },
      { type: 'number', value: 2 },
      { type: '*' },
      { type: 'number', value: 3 },
      { type: '*' },
      { type: '+' },
      { type: 'number', value: 5 },
      { type: 'number', value: 3 },
      { type: '*' },
      { type: '+' },
      { type: 'number', value: 5 },
      { type: '+' },
    ]);
  });
});
