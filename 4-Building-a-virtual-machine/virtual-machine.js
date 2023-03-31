const assert = require("assert").strict;

const vm = (/* 20 bytes, number[] */ memory) => {
  /* 16 bit registers */
  const registers = [0, 0, 0];
  const OP_CODES = {
    LOAD: 0x01,
    STORE: 0x02,
    ADD: 0x03,
    SUB: 0x04,
    HALT: 0xff,
  };

  while (1) {
    let [programCounter, register1, register2] = registers;
    let currentInstruction = memory[programCounter];
    let param1 = memory[programCounter + 1];
    let param2 = memory[programCounter + 2];

    switch (currentInstruction) {
      case OP_CODES.LOAD:
        /* Load 2 8-bit memory slots into 1 16-bit register */
        registers[param1] = memory[param2] + 256 * memory[param2 + 1];
        break;
      case OP_CODES.STORE:
        /*
          Store 16-bit register into 2 8-bit memory slots. convert 16 bit to 8
          + 8 bit
          */
        const hex = register1.toString(16).padStart(4, "0");
        const leastSig = parseInt(hex.slice(2), 16);
        const mostSig = parseInt(hex.slice(0, 2), 16);

        memory[param2] = leastSig;
        memory[param2 + 1] = mostSig;
        break;
      case OP_CODES.ADD:
        registers[1] += register2;
        break;
      case OP_CODES.SUB:
        registers[1] -= register2;
        break;
      case OP_CODES.HALT:
        return;
    }
    registers[0] += 3;
  }
};

/*
  1 + 2 should equal 3
*/
const testMemory1 = [
  0x01, 0x01, 0x10, 0x01, 0x02, 0x12, 0x03 /* add */, 0x01, 0x02,
  0x02 /* store */, 0x01, 0x0e, 0xff, 0x00, /* output */ 0x00, 0x00,
  /* input 1 */ 0x01, 0x00, /* input 2 */ 0x02, 0x00,
];
vm(testMemory1);
assert.equal(testMemory1[14], 3);
assert.equal(testMemory1[15], 0);

/*
  0 + 1 should equal 1
*/
const testMemory2 = [
  0x01, 0x01, 0x10, 0x01, 0x02, 0x12, 0x03 /* add */, 0x01, 0x02,
  0x02 /* store */, 0x01, 0x0e, 0xff, 0x00, /* output */ 0x00, 0x00,
  /* input 1 */ 0x00, 0x00, /* input 2 */ 0x01, 0x00,
];
vm(testMemory2);
assert.equal(testMemory2[14], 1);
assert.equal(testMemory2[15], 0);

/*
  5 - 2 should equal 3
*/

const testMemory3 = [
  0x01, 0x01, 0x10, 0x01, 0x02, 0x12, 0x04 /* subtract */, 0x01, 0x02,
  0x02 /* store */, 0x01, 0x0e, 0xff, 0x00, /* output */ 0x00, 0x00,
  /* input 1 */ 0x05, 0x00, /* input 2 */ 0x02, 0x00,
];
vm(testMemory3);
assert.equal(testMemory3[14], 3);
assert.equal(testMemory3[15], 0);

/*
  Max integer should be (2^16) - 1 == 65,535
  65,534 + 1 should equal 65,535
*/

const testMemory4 = [
  0x01, 0x01, 0x10, 0x01, 0x02, 0x12, 0x03 /* add */, 0x01, 0x02,
  0x02 /* store */, 0x01, 0x0e, 0xff, 0x00, /* output */ 0x00, 0x00,
  /* input 1 */ 0xfe, /* 65,534 */ 0xff, /* input 2 */ 0x01, 0x00,
];
vm(testMemory4);
assert.equal(testMemory4[14], 0xff);
assert.equal(testMemory4[15], 0xff); // equals 65,535 in little endian
