# Notes

- "stack frame" just refers to a portion of memory in the stack, from one
  address to another, that stores information about a particular function call
- x86 the stack %rsp register goes from higher addresses to lower addresses as
  you push items to the stack
- "Passing control" from one function to another is just setting the program
  counter to the starting address for the new function. However, when the new
  function is called, the return address (the address right before the new
  function was called, in the old function) is pushed to the stack. So, when the
  old function's stack frame is popped from the stack (the %rsp is decremented),
  the first thing that appears is the return address from the old function,
  right after the new function was called.
- Don't forget — the program is stored IN MEMORY
- %rip, the instruction pointer, is the program counter
- Long is a 32 bit number
- arguments passed in with %rdi and %rsi, and returned with %rax
- rsp+8 points to a value 8 bits "up", or older, in the stack, since addresses go down as
  you push to the stack
- old register values can be saved to the stack, and then popped out again and
  moved back to their respective registers
- "caller saved" registers can be altered by any function, so if you need the
  value in some register, you should save it so that if another function uses
  it, you can retreive that value later. The opposite is the "callee-saved"
  registers that must have their values preserved by the called function.
- `subq $N, %rsp` allocate N bytes on the stack frame
- `0x8(%rsp)` means "get the location on the stack that is 8 bytes away from the
  stack pointer %rsp, and then take the value at that address."
- So is the stack only incremented in bytes rather than bits?
- why the `$0x1` syntax? Why not just `1`?
