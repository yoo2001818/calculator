export function parse(tokenizer) {
  let state = {
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
  };
  return main(state);
}

function expect(token, type) {
  let tokenType = (token == null ? 'null' : token.type);
  if (type !== tokenType) throw new Error('Expected ' + type);
  return token;
}

function suggest(token, type) {
  let tokenType = (token == null ? 'null' : token.type);
  return tokenType === type;
}

function main(state) {
  // Expression
  return addExpr(state);
}

function addExpr(state) {
  // Get left
  let left = mulExpr(state);
  // If + is received, continue assemblying addExpr; Otherwise just stop.
  if (suggest(state.peek(), '+')) {
    let right = mulExpr(state);
    // Assemble these two...
    return [].concat(left, right, '+');
  } else {
    return left;
  }
}

function mulExpr(state) {
  let left = value(state);
  // If * is received, continue assemblying mulExpr; Otherwise just stop.
  if (suggest(state.peek(), '*')) {
    let right = value(state);
    // Assemble these two...
    return [].concat(left, right, '*');
  } else {
    return left;
  }
}

function value(state) {
  return [expect(state.next(), 'number').value];
}
