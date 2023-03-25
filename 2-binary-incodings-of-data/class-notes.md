# Binary encodings of data

## questions

- limited direct execution model: user processes are directly executed on the
  CPU. How does the operating system get control again? There are hardware
  mechanisms, `timer interupts`, a periodic switch that the CPU interups with.
  - update the program counter to the new address where handler resides. The
    kernal code.
  - grabs control back to the kernal. It used to happen on cheaper PCs.
- how to make CPU faster?
  - mohr law
  - denard scaling, make things smaller
  - 3d layering can also make things closer together

# Leaky abstractions

- 0.1 + 0.2 != 0.3 This is the leaky abstraction!
- These errors often are worse because they cause precision errors over time!
- calculators _don't_ use floating point! They use fixed point precision, which
  is why their decimal operations look correct to us.
- ALU is part of the CPU and does the addition. Multiplication is just addition
  over a loop.
- `1 << 2`, 2^2. You're just moving the bits to the left.
- 1 << 2 is multiplying by 2?
- _Learn the powers of 2!_
- 32 bit system can talk to 4gb of ram. 2^32.

# Prework questions

- Hexadecimal just helps us read binary. Helps our eyes parse it out.
- "carry lookahead", makes adding 64 bit numbers faster, because the carry takes
  a long time, o(64)
- "sign magnitude" schema IS used for floating points, but not integers
- we don't want -0 anywhere. But 1's complement is in TCP and UDP headers
- 2's complement, smallest thing we can encode in 4 bits is -8. `1000`.
- CPU doesn't know about signed or unsigned. There are different ops for signed,
  unsigned. Like `ADD` `UADD`. You have to specify it.
- 2^4 is 16.
- C type would be `UINT32`, to specify unsigned.
- RAX and EAX, you can refer to a portion of a larger register
- AX is the larger register?
- 2's complement sign bit is a `bias` , don't think of it as a sign.
- `-8 + 1` is `-7`. Not thinking of sign bit as a sign. It's bias bit.
- `1 << 31` is making a two's complement signed integer!! Smallest possible 32
  bit signed integer.
- `2 ** 55 + 2` check around here... Integer arithmatic with floating point.
- JS `Number` is a `Float`!
- `typeof(NaN)` should say "float".
- JS exposes floats to the user. So it's all intentional, don't think that it's
  integers.
- `1000`, like -8. The weighted way. + 1 would make it -7.
- Difference between `>>>` (this actually shifts the bits , _logical_) and `>>`
  (arithmatically shifting the bits)
- unicode has heiroglyphs
- how is a TCP port encoded? In 2 bytes. What's the range of valid ports? 2^16,
  exclusive.
- largest amount you can write in one byte is 255: `1111 1111`.
- TCP uses big endian
- difference between "computer" and "software" engineer.
- SWE doesn't need to worry about bit ordering because memory is byte-addressable.
- File system encodes your byte ordering on the hard drive. So you have to be
  careful always with byte ordering. So a portable hard drive will list it's own
  <!-- go/inclusivecode Exempt(reason <TODO: free-form>) -->
  byte ordering in the Master Record at the beginning.
- Modems have to decide which comes first, low or high ordered bit first, e.g.
  LSB, but we don't worry about it as software engineers — that's for hardware engineers.
