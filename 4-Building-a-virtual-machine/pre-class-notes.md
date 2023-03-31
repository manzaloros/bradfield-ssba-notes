# Building a virtual machine

- Python interpreter is written in C
- Bytecode is the list of instructions assembled. Each instruction comes one
  after another and is loaded into memory
- 16 bit integer limit is 65,535 (2^16 - 1).

- `switch` will execute all `case` blocks after the first matched `case` block
  if you don't add a `break;` statement! It doesn't `break` automatically
