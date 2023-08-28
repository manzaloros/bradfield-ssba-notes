# Varint notes

- Variable width integer encoding in protocol buffers
- Variable width integers not specific to protocol buffers
- Stopped video at 6:45.

## Protocol buffers
- Thrift, Avro.
- "Wire" format. Encoding of bytes that gets transmitted over the network that's compact, can encode schemas, fast encoding and decoding relative to JSON.
- Numbers sent over wire are often small, though some can be big. If you use a fixed width encoding, there will be a lot of wasted space with smaller numbers.

## Big-endian, little-endian
- Different conventions, arbitrary.
- 123: 1[hundreds]2[Tens]3[ones], convention for writing numbers.
- Byte ordering. NOT the bit ordering. The bits are still ordered big-endian.
- TCP or UDP port, value from 0 to 2^16. Need two bytes to store this port number.
  - e.g. port 0x0102:
    - If the higher-order byte comes first, it would be 256 + 2. The thing on the left is the higher place value. Big endian.
      - This is used in network protocols and AMD machines.
    - Otherwise, it would be (2 * 256) + 1 = 513. Little endian, "Low order on the left". Intel machines use this.
      - Gulliver's travels, eating eggs from the "little end".

## Exercise
- Encode
  - Input: unsigned 64 bit integer
  - Output: sequence of bytes in varint encoding
- Decode:
  - Input: Sequence of bytes in varint encoding
  - Output: unsigned 64 bit integer represented by those bytes
- Most significant bit of each byte:
   - 1, bit is set, means the number continues
   - 0, bit is unset, means number does not continue
- Steps to decode
  - Drop the most significant bits of each byte
  - Convert them to big endian
  - Concatenate the bytes
  - Intepret them as an unsigned 64 bit integer
