# DNS and HTTP (application layer protocols)

## DNS

- hosts.txt was the original host resolution table. 1983.
  - was just distributed as a mailing list. But this causes stale records.
- /etc/host: first point of resolution.
- How many DNS servers in the world? Including bind() instances or recursive
  resolvers.
  - probably in the millions. Very large distributed system.
  - 13 root servers. To resolve TLDs.
  - TLDs, recursive resolvers, authoritative servers, etc.
- Want DNS to fault tolerant. Want high read throughput, handle a high load.
- Want countries to divide domain names.
- If a domain name is not resolved locally, the first DNS server outside your
  network is probably:
  - Not a root, TLD, or an authority server.
  - Can just call it a resolver. Maybe recursive resolver? It is a caching DNS
    server. Not the final answer for anything, but caches records for you. Could
    be your ISP.
    - ISP's incentive is to not pay for upstream traffic if they can avoid it.
    - ISP is a retailer of internet. Job is to sell us internet. ISP buys
      internet from some bigger wholesaler.
- Recursive resolver that's a dedicated machine to this task. Runs `bind()`.
  Google's is 8.8.8.8.
- TLD: **top level domain**
- `dig @g.root-servers.net. wikipedia.org A`
  - gives you back the NS records and their IPs for `org`. Won't give you answer, because it
    doesn't have responsibility for it.
    - but now you can query one of those NS servers. (name server)
  - AAAA records, IPv6. 64 bit addresses.
  - IPv4 only has 4 billion possibilities.
    - You can buy those from MIT at auction.
  - Root servers tell you about like `com.` or `org.` or `jp`, etc. If you want
    to know about `google.com`, you need to ask one of the NS servers.
  - Root servers are VERY america-centric. But you don't have to hit those
    servers from somewhere across the world because of anycast.
  - Root servers, many are owned by the US military (...)
- `dig` just shows you all the root servers it uses. They're hard coded!
- reliable delivery of DNS comes from US retrying, not the connection (like TCP)
- One IP address can map to multiple addresses, routers make that decision at
  Layer 3, storing the previous round trip time for each addresses cached. This
  is called **"anycast"**.
- `.com` is a TLD!!!
- root server -> TLD server -> authoritative -> recursive resolver
  - the root servers are like `a`, `b`, `c`, etc.
- Can't ask for A record from NS server. Have to ask for wikipedia's name server (NS)
  - A record?
- So you need to query wikipedia's name server for the `A record`.
- IP address has a TTL that can change after 10 minutes?
- "Recursive" resolver is misleading because it isn't really a chain of DNS
  servers. The resolver just asks different DNS servers back and forth for the
  answers it needs.
- When you buy a domain name, like `foo.com`, what are you actually getting from
  the registrar?
  - They have authority from ICANN to update the TLD auth servers, like `com.`
    with your NS record
- The closer to the root servers, the longer your TTL is.
- Bit.ly, the `.ly` TLD is the Libyan government...
- "web" and "internet" are two different things
  - web is an application layer protocol sitting on top of TCP
- Tim Berners-Lee
  - proposed hypertext interface that can inter operate with all systems at CERN
    in 1989.
  - Because he was concerned about data loss at CERN
  - Proposed the graph
- Hypertext is links.
  - started as clickable footnotes.

## HTTP

- SMTP, headers added as text. Status codes.
- Hypertext Transfer Protocol
- Netcat, `nc`
  - open socket and concatenate the output to stdout
  - type write into socket itself
- `nc google.com 80`
- carriage-return, line-feed. HTTP headers. Implemented in 1.0, but not 0.9.

```
$ nc google.com 80
GET / HTTP/1.0
Host: google.com

HTTP/1.0 301 Moved Permanently
Location: http://www.google.com/
Content-Type: text/html; charset=UTF-8
Content-Security-Policy-Report-Only: object-src 'none';base-uri 'self';script-src 'nonce-hWDb6TXlRrkZ5MBlb2ZYsg' 'strict-dynamic' 'report-sample' 'unsafe-eval' 'unsafe-inline' https: http:;report-uri https://csp.withgoogle.com/csp/gws/other-hp
Date: Sat, 13 May 2023 01:36:36 GMT
Expires: Mon, 12 Jun 2023 01:36:36 GMT
Cache-Control: public, max-age=2592000
Server: gws
Content-Length: 219
X-XSS-Protection: 0
X-Frame-Options: SAMEORIGIN

<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>
```

- port 80 for web traffic
- `nc -l 1234`

```
$ nc -l 1234 // listen on a port
GET / HTTP/1.1
Host: localhost:1234
Connection: keep-alive
sec-ch-ua: "Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "macOS"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
dnt: 1
sec-gpc: 1

HTTP/1.1 200 all good!

Hi from netcat! // will see this in the browser
^C // give a sig-int so Browser knows the connection is closed
```

- UCS 16 or UTF 16. Browser default encoding.
- Accept-Encoding: mis-named "compression" header.
- Content-Type is where you set the character set. The encoding of text.
- Emojis are UTF 8.
- HTTP just has features that were implemented over time, and then the features
  were ratified later. Quickly. Decentralized, standardized over time. But
  practical!
- Mosaic browser. First serious browser.
  - Mosaic Killer
  - Mozilla
- Microsoft entered the game with Internet Explorer.
  - supported frames.
  - Microsoft put "mozilla" in the user agent in order to show "frames", because
    servers weren't serving it unless you had "mozilla" in the headers.
  - Browser wars.
    - all browsers impersonate every other browser to get all the functionality.
- Before CSS there were "frames", different HTML documents on a page.
- set little experiments with nc or wireshark. Observer headers.
  - without having to resort to googling and medium articles that are
    misleading.
  - first principles.
- http requests are stateless
  - How to share state between requests? like a shopping cart.
    - Cookie
      - Set-Cookie Header
      - cookie is namespaced to the domain
      - cookies can have scope
      - Response includes key=value cookies in the header.
      - log in -> response returns sessionid -> you send sessionid with request
    - Store sessionID as a cookie.
      - just a unique identifier that is a placeholder for being logged in.
      - So if a user has the sessionID, you know they're logged in.
      - The sessionID is a key in a database.
    - you can impersonate someone if you get a hold of their session id.
    - Don't send secrets over plaintext
- csrf
  - give a new token when you want a response
  - cross site request forgery
  - you want to know the same person who filled out the form is the same person
    you sent it to
- What about 2 factor authentication?
- Don't install chrome extensions
  - they can capture your keys
- How do websites make requests to other ad sites?
  - getting "pixeled"
  - a tiny transparent gif makes a request to `fb-ads.com`. HREF in the gif
    makes the request?
    - which sets a cookie in your browser
    - cookie needs to be the same host name
  - Send request to a 3rd party header?
