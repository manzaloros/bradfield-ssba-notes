## Fetch-decode-execute cycle

What is your clock speed?
thoughts:
store time, do addition, store time2, return time2 - time1

## Fetch

1. Address in Program Counter register copied to Memory Address Register
2. PC incremented to point to the next instruction
3. Instruction at the address pointed to by the MAR is copied to the Memory Data Register
4. Instruction in the MDR copied to the Current Instruction Register.

## Decode

5. Control Unit decodes the contents of the CIR.

## Execute

6. CU sends signals to the correct component, like the Arithmatic and Logic Unit.

## From Bradfield Site

- 1 address in register points to an address of RAM that stores 8 bits of data (byte)
- Register has 32 bits to store addresses, on 32 but architecture.
- 32/8 == 4. (Wrong)
- 1 Register can store 2^32 addresses. 4 billion, each corresponding to a byte of RAM
- I misunderstood the question. I thought: how many addresses can fit in register at once.
- Actually, it’s how many RAM addresses could a register possibly point to, since it can only hold one address at a time.
- So programs on 32 bit systems can only access 4GB of ram.

  ————————————-

- Program to demonstrate size of register
- Accumulate a variable until it can’t fit in the register anymore?
- 1 address in register points to an address of RAM that stores 8 bits of data (byte)
- Register has 32 bits to store addresses, on 32 but architecture.
- 32/8 == 4. (Wrong)
- 1 Register can store 2^32 addresses. 4 billion, each corresponding to a byte of RAM
- I misunderstood the question. I thought: how many addresses can fit in register at once.
- Actually, it’s how many RAM addresses could a register possibly point to, since it can only hold one address at a time.
- So programs on 32 bit systems can only access 4GB of ram.

  ————————————-

- Program to demonstrate size of register
- Accumulate a variable until it can’t fit in the register anymore?
- Called overflow
- Arithmetic: in loop, raise value to power of 2, print value if error?
- Bit wise, loop, left shift value by 2, equivalent of multiplying by 2? Just start with a long constant number 1L, left shift 63, print the value, left shift 1, print the value again. It will be 0.
- Put L at end of number to represent a Long constant. Otherwise it’s interpreted as an int?

- Print program counter in GDB (GNU debugger)
- Literal notated like 0x is a hexadecimal integer (base 16)
-
- RAM latency (speed). What does it mean for fetch decode execute cycle since values have to be fetched from RAM?
- MacBook Pro 2020 RAM is 3733MHz. 3.733GHz. (Wrong idea, here)
- Does it mean that the speed of ram determines the speed of the cycle?

  ————————————-

- https://www.7-cpu.com/cpu/Skylake.html
- In that link, ram latency is 42 cycles + 51 nanoseconds to fetch value from RAM.
- 1GHz is 1 nanosecond
- 50 ns is .02GHz.
- GHz means the speed of the clock. 2.5GHz means a clock cycle is completed 2.5 billion times a second.
- Nanosecond is 1billionth of a second
- How to find how many cycles complete in certain number of nanoseconds? For a certain processor speed? https://stackoverflow.com/questions/3606898/unit-conversions-ghz-ns-mhz-cycles
- 10^9(1 second in ns) / (4\*10^9 Hz) == 0.25 ns cycle length. 4 cycles per nano second.
- 51 ns\* 4cycles per ns == 204 cycles during 5-ns. 204cycles + 42 additional cycles is 246 cycles on a 4GHz cpu just to fetch a value from RAM.
- Ahmdals law: the amount speed up of a system from speeding up one component depends on how significant the component was in the system and how much you sped it up. To speed up a system you have to improve the speed of a very large portion of the system.
- Concurrency: multiple control flows happening under single process, in single core system it happens by rapidly switching between the processes
- Hyperthreading allows a single cpu to switch between threads on a cycle by cycle basis; has multiple copies of certain registers, like the program counter, and single copies of others. Let’s the CPU more efficiently use its resources switching between threads
- Containers vs. VMs: difference is containers virtualize only down to the
  software layer and VMs virtualize the host hardware.

  ——————

## Questions:

- what is the actual clock mechanism?
- Is hyperthreading only possible with multiple cores? Called overflow
- Arithmetic: in loop, raise value to power of 2, print value if error?
- Bit wise, loop, left shift value by 2, equivalent of multiplying by 2? Just start with a long constant number 1L, left shift 63, print the value, left shift 1, print the value again. It will be 0.
- Put L at end of number to represent a Long constant. Otherwise it’s interpreted as an int?
-
- Print program counter in GDB (GNU debugger)
- Literal notated like 0x is a hexadecimal integer (base 16)
-
- RAM latency (speed). What does it mean for fetch decode execute cycle since values have to be fetched from RAM?
- MacBook Pro 2020 RAM is 3733MHz. 3.733GHz. (Wrong idea, here)
- Does it mean that the speed of ram determines the speed of the cycle?
-
- https://www.7-cpu.com/cpu/Skylake.html
- In that link, ram latency is 42 cycles + 51 nanoseconds to fetch value from RAM.
- 1GHz is 1 nanosecond
- 50 ns is .02GHz.
- GHz means the speed of the clock. 2.5GHz means a clock cycle is completed 2.5 billion times a second.
- Nanosecond is 1billionth of a second
- How to find how many cycles complete in certain number of nanoseconds? For a certain processor speed? https://stackoverflow.com/questions/3606898/unit-conversions-ghz-ns-mhz-cycles
- 10^9(1 second in ns) / (4\*10^9 Hz) == 0.25 ns cycle length. 4 cycles per nano second.
- 51 ns\* 4cycles per ns == 204 cycles during 5-ns. 204cycles + 42 additional cycles is 246 cycles on a 4GHz cpu just to fetch a value from RAM.
- Ahmdals law: the amount speed up of a system from speeding up one component depends on how significant the component was in the system and how much you sped it up. To speed up a system you have to improve the speed of a very large portion of the system.
- Concurrency: multiple control flows happening under single process, in single core system it happens by rapidly switching between the processes
- Hyperthreading allows a single cpu to switch between threads on a cycle by cycle basis; has multiple copies of certain registers, like the program counter, and single copies of others. Let’s the CPU more efficiently use its resources switching between threads
- Containers vs. VMs: difference is containers virtualize only down to the
  software layer and VMs virtualize the host hardware.

  ——————

## Questions:

- what is the actual clock mechanism?
- Is hyperthreading only possible with multiple cores?
