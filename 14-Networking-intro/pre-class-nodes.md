# Networking intro

## Parse pcap-savefile header by hand using `xxd`.

- Magic number: `d4c3 b2a1`
  - indicates that the magic number was read by a host that had the opposite
    byte order of the host that wrote the file
- Major version: `02 00`: version 2.
- Minor version: `04 00`: version 4. Little endian?
  - remember, a byte in hex is two digits, since each digit represents 4 bits,
    so `02` is a byte, or 8 bits.
- Time-zone offset: `0000 0000`. 4 bytes. Apparently it's always 0?
- Time-stamp accuracy: `0000 0000`, which is also always 0.
- Snapshot length: `ea05 0000`.
  - `ea`: 10 + (14 \* 16) == 234. 234 + (5 \* 16^2) == **1514**.
- Link-layer header type: `0100 0000`.
  - Is this 256, which is bluetooth low energy linklayer type?
  - Nope, I forgot that the snapshot length is 4 bytes, (8 hex digits) so I
    started parsing at the wrong location.
  - The link-layer header type is Ethernet, or `1`.
- Overall header length was 24 bytes long.

## First packet

- Length of captured packet data: `4e00 0000`
- Untruncated length of captured packet data: `4e00 0000`
  - since the two lengths are equal, that means the packet was not truncated.

## Count number of packets captured in the file.

- Each packet header starts with 8 bytes (16 hex digits) of timestamp data,
  followed by 4 byte length and a 4 byte untruncated length.
