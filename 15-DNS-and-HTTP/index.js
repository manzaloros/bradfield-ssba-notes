const dgram = require("node:dgram");
const server = dgram.createSocket("udp4"); // use IPv4
const { Buffer } = require("node:buffer");

const GOOGLE_DNS_IP = "8.8.8.8";
const GOOGLE_DNS_PORT = 53;

const ID = "0001";

const response = "0";
const opCode = "0000";
const truncated = "0";
const recursionDesired = "1"; // do not query recursively
const z = "00";
const ad = "1";
const nonAuthenticatedData = "00000";

const flags = 0b000000100100000;

const buf = Buffer.alloc(2);
buf.writeUIntBE(flags, 0, 2);
/* Now this works. TODO, construct the entire packet */
console.log(buf);

server.bind(); // assigns random port

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

/* Send query to a DNS server */
// server.send(message, GOOGLE_DNS_PORT, GOOGLE_DNS_IP);

/* Parse the response */
