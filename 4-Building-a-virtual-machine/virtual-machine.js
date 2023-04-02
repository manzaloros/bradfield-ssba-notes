const assert = require("assert").strict;

/*
  Are you supposed to store the flag in a register or in a memory slot?
 */

const INPUT1 = 0x10;
const INPUT2 = 0x12;
const OUTPUT = 0x0e;

const EMPTY = 0x00;

const NEXT_INSTRUCTION = 3;

const OP_CODES = {
  LOAD: 0x01,
  STORE: 0x02,
  ADD: 0x03,
  SUB: 0x04,
  ADD_IMMEDIATE: 0x05,
  COMPARE: 0x06, // compare to constant
  JUMP_IF_NOT_EQUAL: 0x07,
  JUMP_IF_ZERO: 0x08,
  LOAD_CONSTANT: 0x09,
  LOAD_INTO_REGISTER: 0x0a, // set one register equal to another
  JUMP_IF_EQUAL: 0x0b,
  HALT: 0xff,
};

const PROGRAM_COUNTER = 0;
const REGISTER1 = 0x01;
const REGISTER2 = 0x02;
const REGISTER3 = 0x03;
const REGISTER4 = 0x04;
const FLAG_REGISTER = 0x05;

/*
  All instructions are 3 lines apart
*/
const vm = (/* 20 bytes, number[] */ memory) => {
  /* 16 bit registers */
  const registers = [0, 0, 0, 0, 0, 0];

  while (1) {
    let [
      programCounter,
      register1,
      register2,
      register3,
      register4,
      flagRegister,
    ] = registers;
    let currentInstruction = memory[programCounter];
    let param1 = memory[programCounter + 1];
    let param2 = memory[programCounter + 2];

    /*
      TODO: improve this by
      1. separating functions from switch statements
      2. Remove unused functions
    */
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
        registers[param1] += registers[param2];
        break;
      case OP_CODES.SUB:
        registers[param1] -= registers[param2];
        break;
      case OP_CODES.ADD_IMMEDIATE:
        registers[param1] += param2;
        break;
      case OP_CODES.COMPARE: // compare to constant value
        if (registers[param1] === param2) registers[FLAG_REGISTER] = 0;
        else registers[FLAG_REGISTER] = 1;
        break;
      case OP_CODES.JUMP_IF_NOT_EQUAL:
        if (registers[FLAG_REGISTER] === 1) {
          registers[PROGRAM_COUNTER] = param1 - NEXT_INSTRUCTION; // subtract 3 because you will add 3 at the end of switch
          registers[FLAG_REGISTER] = 0; // reset flag
        }
        break;
      case OP_CODES.LOAD_CONSTANT:
        registers[param1] += param2;
        break;
      case OP_CODES.LOAD_INTO_REGISTER:
        registers[param1] = registers[param2];
        break;
      case OP_CODES.JUMP_IF_EQUAL:
        if (registers[FLAG_REGISTER] === 0) {
          registers[PROGRAM_COUNTER] = param1 - NEXT_INSTRUCTION; // subtract 3 because you will add 3 at the end of switch
        } else registers[FLAG_REGISTER] = 0; // reset flag
        break;
      case OP_CODES.HALT:
        return;
    }

    registers[PROGRAM_COUNTER] += NEXT_INSTRUCTION;
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

/*
  1 + 5 should equal 6, using a constant value
*/
const testMemory5 = [
  0x01, 0x01, 0x10, 0x05 /* add immediate*/, 0x01, 0x05, 0x02 /* store */, 0x01,
  0x0e, 0xff, 0x00, 0x00, 0x00, 0x00, /* output */ 0x00, 0x00,
  /* input 1 */ 0x01, 0x00, /* input 2 */ 0x02, 0x00,
];
vm(testMemory5);
assert.equal(testMemory5[14], 6);
assert.equal(testMemory5[15], 0);

/*
  while register 1 isn't 5, Add 1 to register 1

  let a = 0;
  while (a !== 5) a += 1;
*/
const testMemory6 = [
  OP_CODES.ADD_IMMEDIATE,
  REGISTER1,
  0x01,
  OP_CODES.COMPARE,
  REGISTER1,
  0x05,
  OP_CODES.JUMP_IF_NOT_EQUAL,
  0x00,
  EMPTY, // empty byte to maintain 3 byte instruction
  OP_CODES.STORE,
  REGISTER1,
  OUTPUT,
  OP_CODES.HALT,
  EMPTY,
  /* output */ EMPTY,
  EMPTY,
  /* input 1 */ EMPTY,
  EMPTY,
  /* input 2 */ EMPTY,
  EMPTY,
];
vm(testMemory6);
assert.equal(testMemory6[OUTPUT], 5);
assert.equal(testMemory6[OUTPUT + 1], 0);

/*
  TODO:
  nth fib.
  t 2
  c 3
  p 2


  (num) => {
    prev = 0 // reg 1
    curr = 1 // reg 2
    temp = 0;  // reg 3

    while (num != 1) {
      temp = curr;
      curr = curr + prev;
      prev = temp;

      num -= 1 // reg 4
    }

    return prev
  }

  Find 5th fib
*/

const testMemory7 = [
  OP_CODES.ADD_IMMEDIATE,
  REGISTER2,
  0x01, // set curr = 1
  OP_CODES.ADD_IMMEDIATE,
  REGISTER4,
  0x05, // set num = 5
  OP_CODES.COMPARE,
  REGISTER4,
  0x01,
  OP_CODES.JUMP_IF_EQUAL,
  0x1e, // jump to instruction 30 if num == 1
  EMPTY,
  OP_CODES.LOAD_INTO_REGISTER,
  REGISTER3,
  REGISTER2,
  OP_CODES.ADD,
  REGISTER2,
  REGISTER1,
  OP_CODES.LOAD_INTO_REGISTER,
  REGISTER1,
  REGISTER3,
  OP_CODES.ADD_IMMEDIATE,
  REGISTER4,
  -1, // decrement by 1, adding -1
  OP_CODES.COMPARE,
  REGISTER4,
  0x01,
  OP_CODES.JUMP_IF_NOT_EQUAL,
  0x0c, // jump to beginning of while loop
  EMPTY,
  OP_CODES.STORE,
  REGISTER1,
  0x24,
  OP_CODES.HALT,
  0x00,
  0x00,
  0x00, // output, location 36
  0x00,
];

vm(testMemory7);
assert.equal(testMemory7[33], 3);
