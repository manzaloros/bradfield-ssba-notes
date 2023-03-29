# Programming the actual computer

## Floating Point

- Why do we want big numbers, but the bigger the number, the less precision we
  get?
  - scientific notation, need big numbers.
- Imagine floating point as `(A * 10^b)`
- Don't use floating point EVER for money
- Stripe makes API calls with integers, so $5 is `500` in the api call.
- Impossible to represent base 10 `0.1` in binary.
- Can fit alot of integers in 64 bits
- Use floats for science, that's it!
- JS uses floats for the `number` type 😥
- HFT: High Frequency Trading (don't use floats!)
- IEEE 754 (eye-triple E)
  - sign bit, exponent (8 bits), mantissa/significand (23 bits) (the actual
    bits)
  - Exponent includes a bias
  - do the exercise from the previous class to deconstruct a floating point num
    in binary
  - `1 / 0` would be `NaN`
  - JS just follows the floating point spec
- `bit` stands for `binary digit`!!

## Character Encodings, ASCII

- ASCII is american
  - character fits in a byte
  - 128 possible ASCII values
  - structure to the bits
    - ctrl-c is just flipping a bit on an old keyboard
    - getting capital letters is just flipping one bit. Like an old keyboard
      shift key!
    - look at that one ascii table chart that shows the bit structure
    - ASCII has 0 in high-order bit
    - `0000 0000` null terminating character
- UTF8 and Unicode are NOT the same thing
- [UTF 32](old.unicode-table.com)
  - U+2603 is the snowman emoji. 2603 is hexadecimal.
  - Every character takes 32 bits (4 bytes). Higher order bytes will just be 0
    if unused.
  - If you're writing english, it takes a lot of space, you wouldn't need 32
    bits per character.
  - Moby Dick written in emojis
  - Fixed-length encoding, as opposed to a variable length encoding that would
    be different lengths per character
- UTF 8
  - totally backward compatible with ASCII
  - Support anything in unicode
  - `0b110.....10......`; 11 payload bits. This is to display UTF 32?
  - `0b1110...10....10.....`, 3 byte sequence
  - `0b11110.....10....10.....10`, 4 byte sequence
    - helps you jump to the some point in a string
  - Highest order bit starts with a `0` for each character
  - Huge percentage of unicode table is Chinese/Jap/Korean
- If you're going to use something always, use UTF-8. UTF-16 is in JS but only
  for historical reasons.
  - What is '⛄️'.length?
  - grapheme clustering
  - Try pressing the back-space key on an emoji
  - `zero width joiner` special unicode code point, special unicode code point
    that joins unicode code points together. It's called grapheme clustering.
    - 💏, can combine different faces for the kiss emoji
  - `.length` is telling you the number of UTF 16 pairs to encode the string
  - UTF 16 used to be called UCS 16. They made fixed width 16 bits, thinking
    that would be enough
    - "surrogate pair" will allow you to use 2 fixed width characters to encode
      1 thing. 16 for 1 character and 32 bits for that surrogate pair 2 fixed
      width characters
  - UTF 16 is a mess
  - Windows also uses UTF 16
  - You can use UTF 8 in JavaScript in JSON if you're sending over the wire
  - You choose, in your database, how to store characters
  - How do you support cross-database joins work with different characters?
    - you'll have to translate something at some point, it will be converted
  - Multilingual planes!
- UTF 8 is 8 bit units.
- CJK (chinese japanese korean)
- A lot fits in the first two bites of unicode

# Compiling

- [ Godbold ](godbolt.org), compiler explorer
- gcc and clang are different compilers
- compilers compile to machine code. They DO NOT compile to Assembly. They have
  options to let you view it in Assembly to make it easier to read.
- C is higher level language, I guess Assembly is lower level
- `edi` is the parameter being passed in (X86 architecture)
- Can change the optimization via `O0` is the lowest one. Try with `O1` and
  higher.
- There are 6 registers for the first 6 args of a function
  - 7th arg will go on the stack
- `[rsp + 8]` read 8 bytes take whatever's in the stack `PTR` dereference (get
  whatever that address is pointing to)
- `rtn` address is pushed to the stack
- Stack is just a portion of memory
- Calling convention
- `constant folding`, deterministic operations with no side effects will be
  figured out at compile time
- `xor eax, eax` set `eax` to 0.
- clang can simplify an adding loop to a sum of an arithmetic sequence being an
  O(1) operation
- gcc is worse than clang
- Look at your compiled code's disassembly from time to time
- How does compiler convert to O(1) solution? [Check
  here](https://llvm.org/docs/Passes.html#passes-licm)
- `shr` shift right
- `imul` multiply
- `jne` jump not equal, conditional branch
- [Why `xor` instead of `mov eax
0`?](https://stackoverflow.com/questions/1135679/does-using-xor-reg-reg-give-advantage-over-mov-reg-0)
- you can write inline assembly in some languages
- Usually you read more dis-assembly than writing inline assembly.
- Disassembly is the interface the CPU
- You have to look at dissassembly to really see Big O. Asymptotic analysis is a
  lie without that. Learn to program the actual computer, the assembly is that
  interface.
- First principals reasoning
- Modern CPUs have 8 execution ports, modern ALUs
- If you reduce amount of dependency between functions you can get > 1 operation
  per cycle on modern CPUs
  - micro architecture, micro and nano seconds
- Python compiler is not so optimized, but JavaScript compiler is pretty
  optimized
- Compiler is a program, too, that runs on the CPUE
- Interpreter is a C program.
- JVM is a program.
