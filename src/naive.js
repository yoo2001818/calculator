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
  let buffer = null;
  do {
    if (buffer != null) {
      // If + is received, continue assemblying addExpr; Otherwise just stop.
      let left = buffer;
      let op = state.next();
      let right = mulExpr(state);
      // Assemble these two...
      buffer = [].concat(left, right, op);
    } else {
      // Or push the value to output buffer.
      buffer = mulExpr(state);
    }
  } while (suggest(state.peek(), '+'));
  return buffer;
}

function mulExpr(state) {
  let buffer = null;
  do {
    if (buffer != null) {
      // If * is received, continue assemblying mulExpr; Otherwise just stop.
      let left = buffer;
      let op = state.next();
      let right = funcExpr(state);
      // Assemble these two...
      buffer = [].concat(left, right, op);
    } else {
      // Or push the value to output buffer.
      buffer = funcExpr(state);
    }
  } while (suggest(state.peek(), '*'));
  return buffer;
}

function funcExpr(state) {
  if (suggest(state.peek(), 'keyword')) {
    let kwd = state.next();
    expect(state.next(), '(');
    let args = funcArgs(state);
    return args.concat(kwd);
  } else if (suggest(state.peek(), '(')) {
    state.next();
    let output = addExpr(state);
    expect(state.next(), ')');
    return output;
  } else {
    return value(state);
  }
}

function funcArgs(state) {
  let buffer = null;
  do {
    if (buffer != null) {
      // If , is received, continue assemblying funcArgs; Otherwise just stop.
      let left = buffer;
      expect(state.next(), ',');
      let right = addExpr(state);
      // Assemble these two...
      buffer = [].concat(left, right);
    } else {
      // Or push the value to output buffer.
      buffer = addExpr(state);
    }
  } while (suggest(state.peek(), ','));
  expect(state.next(), ')');
  return buffer;
}

function value(state) {
  return [expect(state.next(), 'number')];
}
