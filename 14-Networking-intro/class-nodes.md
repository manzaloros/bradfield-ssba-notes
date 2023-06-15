# Networking Intro

- "multiplexing"

- need to ask this in slack:

  - subnet ELI5
  - public and private IP addresses
  - VPNs

- What happens when you make a network request?
- Encapsulation, layering of responsibilities of different protocols
- IP addresses and hostnames. Why?
  - Longest prefix match
  - Subnet match
  - IP grouped specifically
  - Domain is grouped heirarchically politically
  - IP address can map to many different hostnames geographically
- Who creates DNS query?
  - the OS or the application?
    - the **Application!!**
- Application is **layer 7**
  - DNS, HTTP, SMTP, FTP, Skype (proprietary, not published), Bittorrent (not
    standardized). 1000s of these.
  - Web server -> database is also an application layer networking. JDBC
    protocol, there are different formats.
  - Application is responsible! Programmer is responsible.
  - c standard librarry `getaddrinfo`. This is not an OS system call. This is
    just part of someone's library. This is what is called by Chromium.
  - if using gRPC off the shelf you're using their "wire format"

## OS API for network request

- Now we're in the **transport layer**, layer 4.
- Open a `socket`
  - Berkley Sockets
  - particular API
  - Socket is _the system call_
  - Asking the OS permission to open a socket, like asking the OS to open a
    file
  - have to specify domain, like IPv4 (INET)
  - Bluetooth is also considered one of these domains
  - So sockets aren't just about the internet. Device to device (without the
    internet) or intradevice communication
  - Ports are an addressing mechanisem associated with ports
  - Ports can mean multiple things
  - `loopback` is a fake external interface, like when you open a socket to
    request to localhost
  - "Socket interface", almost everyone uses this.
  - Socket type:
    - stream: TCP
      - TCP is reliable
      - Will segment messages that are too long, numbered by "sequence numbers"
      - Tells you if pieces show up in order
      - SOCK_STREAM. You can send a long stream of data and not worry about out
        of order packets, dropped packets, or duplicated packets at the application layer
    - DGRAM: UDP
      - **DNS actually uses UDP!!**
      - DNS uses it because the query is small, and the response is small.
      - DNS query fits into one packet, usually.
      - UDP actually DOES contain 16-bit one's complement checksum. Protected
        against single-bit flips. (?). Same checksum as TCP.
      - Chrome opens up DGRAM socket system call.
      - `sendto` to send to a specific DNS server address.
      - Then you get back a file descriptor! `fd`. File-like interface to the
        network.
      - UDP doesn't do SYN/ACK handshake. Don't need to establish a context for
        communication.
      - UDP header has a source and destination port, size of payload, checksum.
      - How do you know the domain server?
        - **DHCP: ISP gives you server that will return info about IP addresses
          and DNS servers**
        - hardcoded root server address
        - `etc` (et-see) resolve file
    - RAW:
      - Can do construction of the socket yourself instead of TCP
- Done by the kernel via the system call interface

## IPv4 Layer 3!

- IP header prepended to the UDP header.
- IP is called packet, UDP is called datagram.
- IP header: source address, protocol (UDP, TCP), checksum, TTL (hopcount)
- Done by the kernel via the system call interface
- Really the only protocol for the internet.
- TCP/IP started as a single protocol
- Router shouldn't care about TCP (transport layer stuff). Only the routing
  stuff.
- End to end principal: only deal with something until the very end it needs to
  be.
- Vin Surf and Bob Kann invented TCP/IP over a weekend.

## Link Frame, layer 2/1. Physical layer.

- Could be ethernet (802.3), wifi (802.11), bluetooth, 3G, 4G
- Why does this layer need a protocol? What goes in the address?
  - Destination MAC address (like the router or the wireless access point), source MAC address (your network card's address, hardcoded
    at the factory into your network card, globally unique!)
  - For a single hop, that MAC address.
  - ARP: figuring out MAC address of router.
  - delimits packets
  - CRC32 error correction / detection
- Headers for the packet are like a stack. On each hop one is popped off the
  packet and another is added for the next hop.
- Can you fake your source MAC address? Yes, but it doesn't do anything.
- network interface card: "NIC"?
- There are Organizationally Unique Identifiers that are distributed so MAC
  addresses can be globally unique.
- When the destination receives the packet, the ethernet header is popped, and
  the kernal of that device handles the IP header checking that everything is
  okay. Checksum has to be recomputed every time since TTL changed.
- Link layer header then needs to be different, since it's a different link.
  Protocol might change, MAC addresses change. All for every hop. Constantly
  repackaging at the link layer.
- DOCSYS is for cable internet connection link layer header.
- 8.8.8.8 is a google DNS server. Public DNS service.

## When destination machine receives the packet

- OS looks at packet port and decides if it should accept the packet, or send
  an error back
- Process on that port has a **Socket** is blocked on that port. Blocked on
  reading, like reading a file from disk.
- `recvfrom`. Receive, and tell me who it's from. When this returns you're
  back in user space.
- Port / socket?

  - socket like an open inbox?
  - Port disconnected from the socket?
  - OS has a table:
    - port number: file descriptor for a process, which is a socket
  - socket system call returns a file descriptor
  - `bind` a process to a socket
  - Can have multiple processes share a socket, but thats a more sophisticated
    use case

- Basically the layers of headers are just popped off and handled by different entities

- After the UDP DNS req/res, you then send an HTTP call.
- When you have a problem, figure out which layer it is and who's handling it

## HTTP3 and QUIC

- HTTP2, everybody should be on it.
- HTTP3 implemented in QUIC (both on the application layer). Arbitrary
  multiplexing at the browser level. Used on Google and Youtube.
- IP / UDP / QUIC / HTTP3
- Browser can send multiple requests and not be blocked by each one since
  they're multiplexing.

## Wireshark

- powerful and approachable tool
- can filter for ports
- `dig`, command line query utility
  - doesn't use `getaddr`, uses `bind` tools
- 64 is default TTL starting hop count
- "nibble", low-order 4 bytes
- `tcpdump`, `tdump` on your remote VMs

- Very hard to synchronize clocks over distributed systems

- `mtr` and `traceroute`
- `1e100` is a cute nickname for Google in scientific notation
- With hop times, you can see when a packet goes across the pacific ocean.

- Speed of light: photon can go around the equator about 7 times a second
- fibre optical cable is just photon bouncing around

- implement RAW socket with traceroute.

## How about encryption?

- TLS would be a secure socket. Done in **user** space!
- Like OpenSSL. Don't handroll it, haha.
- OpenSSL is user space code, NOT a system call! Mediating socket access.
  Abstraction on the socket abstraction. Applies encryption algorithms and sends
  it over the socket. Application layer protocol. SSH uses it.
- OpenSSL not really maintained by that many people. Can have crazy
  vulnerabilities.
- RSA for key exchange, etc. Part of the negotiation process.
- Green padlock in Chrome? Endpoint verification?

### VPN?

- IPSEC is common implementation
- IPSEC burrito, envelopes the packet with a fake IP header and footer that gets your
  packet to the VPN server (so there's a footer at the end). VPN server
  decrypts that fake IP address to send it to the intended actual destination.

- throughput and latency?
