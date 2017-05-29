const Token = (type) => () => ({ type });
const NoOp = () => undefined;

const SYNTAX_TABLE = {
  main: [
    [/[-+]?0x[0-9a-fA-F]+/g,
      (match) => ({ type: 'number', value: parseInt(match[0]) })],
    [/[-+]?(\d+)(\.\d+)?/g,
      (match) => ({ type: 'number', value: parseFloat(match[0]) })],
    [/([a-z]+)/g, (match) => ({ type: 'keyword', value: match[0] })],
    [/\+/g, Token('+')],
    [/-/g, Token('-')],
    [/\//g, Token('/')],
    [/\*/g, Token('*')],
    [/\(/g, Token('(')],
    [/\)/g, Token(')')],
    [/,/g, Token(',')],
    [/\s+/g, NoOp],
  ],
};

export default function * tokenize(code) {
  let state = { mode: 'main' };
  let index = 0;
  while (index < code.length) {
    let syntaxes = SYNTAX_TABLE[state.mode];
    let results = [];
    for (let i = 0; i < syntaxes.length; ++i) {
      let syntax = syntaxes[i];
      let pattern = syntax[0];
      pattern.lastIndex = index;
      let result = pattern.exec(code);
      if (!result || result.index !== index) continue;
      let callback = syntax[1];
      results.push([result, callback]);
    }
    if (results.length === 0) {
      let sliced = code.slice(index);
      let pos = sliced.search(/\s/);
      if (pos === -1) pos = sliced.length;
      let error = new Error('Unknown token ' +
        sliced.slice(0, pos));
      throw error;
    }
    let next = false;
    for (let i = 0; i < results.length; ++i) {
      let result = results[i][1](results[i][0], state);
      if (result !== undefined) yield result;
      index = results[i][0][0].length + index;
      next = true;
      break;
    }
    if (!next) {
      index = results[results.length - 1][0][0].length + index;
    }
  }
}
