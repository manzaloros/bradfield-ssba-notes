# Bradfield class 1 pre class notes

# Hexadecimal

- after F, it goes to 10
- After 1F, it goes to 20
- Hex notation is just a convenience for humans to interpret binary numbers, it has no significance to machines
- Largest number that can be represented by 8 bits is 0xff
- The 0x just specifies hex notation
- F is 15, so 0xff is 255
- Each digit of hex notation can represent 4 bits.
  ￼
- so an 8-bit computer can work with numbers from 0x00 to 0xff. 0 to 255 (16 possibilities \_ 16 possibilities).
- It all comes back to how big a number the register can hold. How large an address in memory can be.
- Why hex instead of decimal? Because hex can represent groups of 4, 8, or 16 bits more clearly than decimal can.
- Each character of hex is tied to a block of 4 binary values, bits.

| decimal | binary | hex |
| ------- | ------ | --- |
| 0       | 0000   | 0   |
| 15      | 1111   | F   |

## Conversion

- 9: 0x9
- 136: 0x88
- 247: 0xf7
- To hex: Divide decimal num by 16, each remainder is digit of the hex number starting with the least significant digit
- To dec: multiply each digit by 16 to the appropriate power, adding them together

## CSS Colors

- how many colors can be represented by RGB (255,255,255)? 16m
- Hex 0xffffff? 16m
- Each hex char is 2^4
- Guess the color.
- Convert each hex to decimal
- Guess depending on mixing the colors
- (16^1 \_ digit) + (16^0 \* digit)

## Hello hex

- 17byte file. How many hex characters would you expect?
- 1 byte is 2 hex characters. 2\*17 == 34
- xxd gives you hexadecimal view of a file
- Convert first five bytes of hellohex to binary:

| hex char | binary representation |
| -------- | --------------------- |
| 6        | 0b0110                |
| 8        | 0b1000                |
| 6        | 0b0110                |
| 5        | 0b0101                |
| 6        | 0b0110                |
| c        | 0b1100                |
| 6        | 0b0110                |
| c        | 0b1100                |
| 6        | 0b0110                |
| f        | 0b1111                |

- can also do `xxd -b -l hellohex`

  - -b is binary dump
  - -l stop after writing l octets
  - octet is 2 hex chars. **a byte**!
  - don't forget the `0b` for binary representation

- Two hex characters is a byte

# Integers

- To go from dec to bin, go dec -> hex -> bin
- dec to hex you keep dividing number by 16, and the remainder is the next least
  significant digit
- hex to bin you just convert one hex character at a time

| decimal | binary      |
| ------- | ----------- |
| 4       | 0b0000 0100 |
| 65      | 0b0110 0001 |
| 105     | 0b0110 1001 |
| 255     | 0b1111 1111 |

- Sign and magnitude, like 1001 meaning -1, doesn’t really work because you
  can’t do binary addition easily with negative numbers. Also has -0 problem,
  two different representations of 0.
- 1’s complement: turn 0 to 1 and 1 to 0. Also has -0 problem. Still uses the
  leftmost but to represent sign. When adding, you take any carryover 1 and add
  it back to the rightmost bit.
- 2’s complement: same as 1’s complement but with added 1 to rightmost bit.
  Makes it so you don’t have -0 problem. You do NOT do anything with carryover,
  you through the leftmost bit away if there’s any carryover. The caveat here is
  you get a 1000, which is -8 in 2’s complement, but the positive side only goes
  up to 7 (0111). An overflow can be detected if the leftmost bit carry out is
  the opposite sign of the number you’re carrying in.
- Question: when you’re doing long division, how do you know division for two
  digit numbers? Just guess? (E.g. 96/16)
- 255 in decimal is 0b1111 1111
- “Converting dec to bin is a matter of removing the highest power of 2 and
  adding 1”. What???
- 10:2,11:3,1101100:108,1010101:85
- When binary adding, if the result for a column is 2, put a 0 down and carry a
  1. If the result is 3, put a 1 down and carry the 1.
- Overflow for an 8 bit register will make the actual value appear to be (sum %
  256). 256 being the max value of 8 bits.
- 2’s complement conversions: 127:0b0111 1111, -128: , -1:0b1111 1111, 1: 0b0000
  0001, -14: 0b1111 0010
- Scratch what I said earlier about converting dec to bin by doing hex first.
  Just to the dec to hex conversion but use 2 instead of 16.
- Is the whole point of 2’s complement just so you can add negative binary
  numbers?
- Remember when adding 2’s complement that you don’t add the sign bit?
- 2’s complement: figure out sign bit, if negative, flip all bits except sign,
  add 1.
- 2’s complement: 0b1000 000… is the most negative possible value. Combined with
  other numbers provides gives a weight of 2^(number of available bits - 1). So
  the most negative number in 8bits is -128, (0b1000 0000). Representing -127 is
  then 0b1000 0001. Least negative number would be -1, 0b1111 1111. So the least
  negative number looks like the highest positive number.
- Convert from 2’s complement back to decimal. I don’t entirely understand this,
  but: flip all bits including sign (I thought in the conversion process the
  other way you don’t flip the sign), add 1, convert the number to decimal and
  add negative sign.
- -1 looks like the biggest positive number but it’s the smallest magnitude
  negative number
- 127+(-128) shows largest magnitude positive num plus largest magnitude
  negative num.
- Negate a num: make a positive num negative
- For 2’s complement, don’t worry about adding sign.
- Subtraction of 2’s complement is just negating the second argument (flipping
  bits and adding 1) and adding it to the first

# Byte Ordering

- Big Endianness, most significant byte is to the left.
- Little Endian is **L**east significant byte is to the **L**eft
- The order of the bits in the bytes doesn't change, but the bytes themselves
  are placed in different orders.
  - So, BE: biggerByte smallerByte. LE: smallerByte BiggerByte
- `xxd -b` to view in binary (default is hex).
- Looking at 2 bytes in hex: 2329, you have to start at (9) + (16 _ 2) + (16^2 _ 3) + (16^3 \* 2). So you **do** keep going up in exponents to 16 for all 4
  numbers. You don't reset to 16^0 and 16^1 and the `3` in the `23`. By the
  way, this is 9001 in big endian notation.
- So, to repeat, the bytes are ordered differently, not the bits.
- 2 hex characters == an octet of bits

| sequence number | acknoledgement number | source port | destination port |
| --------------- | --------------------- | ----------- | ---------------- |
| 1142845544      | 4025655298            | 44800       | 48134            |

# Todo: IEEE floating point. Can do the bitmap stretch goal if you have time leftover. ASCII.
