const OPERATORS = {
  'keyword': 4,
  '+': 2,
  '-': 2,
  '/': 3,
  '*': 3,
};

export default function shuntingYard(tokenizer) {
  let output = [];
  let stack = [];
  let tokenState = tokenizer.next();
  while (!tokenState.done) {
    let token = tokenState.value;
    switch (token.type) {
      case 'number':
        output.push(token);
        break;
      case 'keyword':
      case '+':
      case '-':
      case '/':
      case '*': {
        // Compare precedence with top of the stack
        let peekToken = stack[stack.length - 1];
        while (peekToken != null &&
          OPERATORS[peekToken.type] >= OPERATORS[token.type]
        ) {
          output.push(stack.pop());
          peekToken = stack[stack.length - 1];
        }
        stack.push(token);
        break;
      }
      case '(':
        stack.push(token);
        break;
      case ')': {
        while (stack.length > 0) {
          let pullToken = stack.pop();
          if (pullToken == null) throw new Error('Unmatched parens');
          if (pullToken.type === '(') {
            let peekToken = stack[stack.length - 1];
            if (peekToken != null && peekToken.type === 'keyword') {
              output.push(stack.pop());
            }
            break;
          } else {
            output.push(pullToken);
          }
        }
        break;
      }
      case ',': {
        let peekToken = stack[stack.length - 1];
        while (peekToken != null && peekToken.type !== '(') {
          output.push(stack.pop());
          peekToken = stack[stack.length - 1];
        }
        break;
      }
    }
    tokenState = tokenizer.next();
  }
  // Send all remaining tokens to exit
  while (stack.length > 0) {
    let token = stack.pop();
    if (token.type === '(') throw new Error('Unmatched parens');
    output.push(token);
  }
  return output;
}
