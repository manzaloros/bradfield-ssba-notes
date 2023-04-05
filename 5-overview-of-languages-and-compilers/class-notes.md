# Overview of languages and compilers

- python interpreter is written in C
- Need to launch a virtual machine to run the python program
- `file` gives you info about the file
- python.exe will be a binary file. Raw data sent directly to the CPU to execute
  instructions
- `otool -tVj <file>`, can also use `objectdump`
- `python.exe` takes input as python code, outputs bytecode. At the machine
  level, the bytecode will look like a bunch of binary data. That data can't be
  understood by an Intel CPU.
- Some C compiler compiles python code, like clang or GCC.
- Python interpreter interprets the bytecode, not the actual hardware.
- We send bytecode to the interpreter
- What is the program that interprets the bytecode? `python.exe`. It has more
  than one job — it turns py file into bytecode AND it interprets it.
- Bytecode NEVER is converted to machine code. It just causes hardware things to
  happen.
- But the Binary in python.exe still is compiled to machine code. The artifact
  is python.exe.
- Bytecode is NEVER converted to machine code! The interpreter is what's
  written in machine code, in python.exe
- You need a different version of python.exe for every architecture you're going
  to run it on. But maintainers don't worry too much because C compilers run on
  multiple architectures.
- Advantages of VM
- python program.py -> bytecode (lives in RAM, doesn't produce a file, but could
  be a .pyc file)
- python.c -> python.exe, this executable interprets the bytecode
- a .jar file is like a .pyc file. But a .jar file is more portable and
  distributable.
- Interpreter can provide APIs for garbage collection, multithreaded support,
  etc.
- Compiled language takes time
- LLVM generates intermediate language, LLVM's back-end turns it into machine
  code for different architectures
- Interpreted languages run on a VM
- Interpreters are NOT the same as "just in time" compilers
- Compiled languages take time but can give you more type safety
- Java is "compiled" to bytecode but it runs in a VM
- Just in time (JIT)
  will notice that you're going through a loop a lot and convert that loop into
  machine code
- [JavaScript](https://medium.com/jspoint/how-javascript-works-in-browser-and-node-ab7d0d09ac2f)
- JIT is like a bridge between bytecode and machine code
- "runtime" vs. virtual machine. Runtime means having libraries that make life
  easier for a programmer during a running program. It's like the little world
  around the program that makes life easier for you.
- A parser builds a tree
