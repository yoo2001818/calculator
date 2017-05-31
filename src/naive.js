export default function parse(tokenizer) {
  let state = {
    output: [],
    buffer: [],
    next: () => {
      if (state.buffer.length > 0) {
        return state.buffer.shift();
      }
      const { value, done } = tokenizer.next();
      if (done) return null;
      return value;
    },
    peek: () => {
      if (state.buffer.length === 0) state.buffer.push(state.next());
      return state.buffer[0];
    },
    push: (value, type) => state.output.push({ value, type }),
    peekOutput: () => state.output[state.output.length - 1],
  };
  return main(state);
}

function expect(token, type) {
  let tokenType = (token == null ? 'null' : token.type);
  if (type !== tokenType) {
    throw new Error('Expected ' + type + ', but got ' + tokenType);
  }
  return token;
}

function suggest(token, type) {
  let tokenType = (token == null ? 'null' : token.type);
  return tokenType === type;
}

function main(state) {
  // Expression
  let result = addExpr(state);
  expect(state.next(), 'null');
  return result;
}

function addExpr(state) {
  // If we already have addExpr in the output head, assemble using *.
  if (suggest(state.peekOutput(), 'addExpr')) {
    // If * is received, continue assemblying addExpr; Otherwise just stop.
    let left = state.output.pop().value;
    let op = state.next();
    let right = mulExpr(state);
    // Assemble these two...
    state.push([].concat(left, right, op), 'addExpr');
  } else {
    // Or push the value to output buffer.
    state.push(mulExpr(state), 'addExpr');
  }
  // Continue addExpr if possible
  if (suggest(state.peek(), '+')) {
    return addExpr(state);
  } else {
    return state.output.pop().value;
  }
}

function mulExpr(state) {
  // If we already have mulExpr in the output head, assemble using *.
  if (suggest(state.peekOutput(), 'mulExpr')) {
    // If * is received, continue assemblying mulExpr; Otherwise just stop.
    let left = state.output.pop().value;
    let op = state.next();
    let right = value(state);
    // Assemble these two...
    state.push([].concat(left, right, op), 'mulExpr');
  } else {
    // Or push the value to output buffer.
    state.push(value(state), 'mulExpr');
  }
  // Continue mulExpr if possible
  if (suggest(state.peek(), '*')) {
    return mulExpr(state);
  } else {
    return state.output.pop().value;
  }
}

function value(state) {
  return [expect(state.next(), 'number')];
}
