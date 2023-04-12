# Runtimes and memory management

- ## My question: what is stored on the heap?
- ## Answer: when malloc is called
- Stack: stores frames for each function call. It stores:
  -Local variables, return memory
  address, function arguments, pointers to objects (which are stored on the heap!)
- `malloc` pronounced "mallock"
- Stack memory vs "stack based vm"
- Is the heap unstructured?
- multi threaded code. **Each thread needs it's own stack!**

# The Stack: walking through factorial recursive function

- make sure to use a big terminal to run this progam!
- %rip, instruction pointer. The program counter points to the memory location
  at the top of the stack.
- %rsp, stack pointer. Stacks go DOWN in memory addresses as you push items
- %rax, conventional return value register
- %rdi, first argument to the function
- allocate 0x18 stack memory, by `subq` subtracting from the stack pointer
  - Why do we subtract?
    - because we're moving the stack pointer to a lower memory address. How do
      you know the region in the stack is free? The OS provides it for you and
      guarantees it's available.
  - That 0x18 makes the stack frame size. It's decided by the compiler that it's
    just enough space for local variables it needs.
  - Depending on your architecture , a stack frame might have some
    unused space if what you're storing isn't exactly a multiple of a byte.
  - There is not a 1:1 mapping of variables in your function to size of your
    stack
- if a process is multithreaded, it will use multiple stacks
  - however, **different threads within one process will share the same heap.**
- "process" in the context of computing
- The process asks the kernal for stack allocation
- movq %rdi 0x8(%rsp). Transfer rdi to 8 offset from the %rsp. (positive means
  it's looking 8 UP in the stack). (0x10 + %rsp)
- comparison will set some flags for any following jump statements
- When you call a function, you jump to the memory address of the function (by
  putting the location on the stack), and
  you need to save the memory location of the next instruction, by pushing that
  to the stack
  - callq also increments the stack pointer?
- addq $0x18, %rsp pops the stack
- retq pops the value AND sets the instruction pointer to that value.
- %rbp points to the previous stack frame. It keeps track of each of the stack
  frame and gives you a way to go to the previous stack frame. It helps alot
  with debugging.
- subq vs subl there are different kinds of arithmatic operations
- **stack is an array of bytes!**

```
int x = 5;
int y = 10;

int* p = &y;

printf('%d\n', *(p + 1)) // prints 5!
```

- Incrementing a pointer increments by one stack value? Pointer arithmatic.
- `char` pronounced "car".
- `char*` lets you refer to one byte locations
- `long long` what type is this?
- You can access arbitrary bytes on the stack

# The Heap

- memory that persists through the life of the program
- Store very large data in the heap
- Pre-allocate the memory ahead of time, with `malloc()`
- `void * ` just means the function signature can't really know how much memory
  you want to allocate with `malloc()`
- You won't know ahead of time how many bytes your program will need.
- Can you have "holes" in memory by freeing up different parts of allocated
  memory. It's called "external" fragmentation. The designer of the `malloc`
  function has to worry about that to minimize those situations.
- does `free()` clear all the bits in that allocated memory? It might clear some
  of it, and it might use some of the bits to store metadata about the space.
- Heap space depends on how often your program calls malloc
- `vmmap PID` checkout memory allocation
- Array could be stored in the stack, but if you need to dynamically store
  memory, it would go on the heap
