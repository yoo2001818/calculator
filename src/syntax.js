let syntaxTable = {
  expression: [['additiveExpression', (t) => t]],
  additiveExpression: [
    ['multiplicativeExpression', (t) => t],
    ['additiveExpression', 'plus', 'multiplicativeExpression',
      (t1, _, t2) => t1 + t2],
    ['additiveExpression', 'minus', 'multiplicativeExpression',
      (t1, _, t2) => t1 - t2],
  ],
  multiplicativeExpression: [
    ['functionExpression', (t) => t],
    ['multiplicativeExpression', 'asterisk', 'functionExpression',
      (t1, _, t2) => t1 * t2],
    ['multiplicativeExpression', 'slash', 'functionExpression',
      (t1, _, t2) => t1 / t2],
    ['multiplicativeExpression', 'percent', 'functionExpression',
      (t1, _, t2) => t1 % t2],
  ],
  functionExpression: [
    ['unaryExpression', (t) => t],
    ['keyword', 'parenOpen', 'functionArgs', 'parenClose',
      (kwd, _, args) => Math[kwd].apply(null, args)],
  ],
  functionArgs: [
    ['expression', (t) => [t]],
    ['functionArgs', 'comma', 'expression', (a, _, t) => a.concat([t])],
  ],
  unaryExpression: [
    ['number', (t) => t],
    ['keyword', (t) => t], // What am I supposed to do with this?
  ],
};
