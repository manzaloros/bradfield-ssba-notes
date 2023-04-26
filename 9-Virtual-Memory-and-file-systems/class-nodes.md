# Virtual Memory and File Systems

- Not every system call requires hardware support
- `kill` system call or the `kill` command line call that calls the
  aforementioned system call
- User space is anything you do before a system call
- Is the OS (kernal) written in C and is it pre-compiled in storage?
- System call is written in C? Like `open()`, is it in C? No. There's a thin C
  wrapper around the system call. Open invokes an x86 machine instruction called
  syscall. `open()` in Bash is a thin wrapper around the system call.
- `/bin/kill` is a thin wrapper around the `kill system call.
- `pstree -p`
- Section of `man` manual for C standard library
- `man 2 syscalls`, useful page to show system calls implemented in linux
- `man syscall`, calling conventions. `syscall` will switch to the kernal.
- C and Unix involved together but they aren't the same thing. Kernal is
  compiled to machine code.
- Only thing CPU needs to know about syscall is what's in the program counter.
- Some of kernal is written in assembly, but much is compiled C down to machine
  code.

## Virtual memory
- each process executes in it's own address space.
- When you print an address value from a program, that's a virtual address. It's
  an illusion pulled off by the OS.
- `pstree -p` (make sure you're on Linux)
- pick a process then `cat /proc/<process id, pronounced "pid">/maps`
- Shows you virtual addresses of code, stack, head. Stack is in the higher
  addresses. You can see the c standard library is mapped in
- `sudo !!` will override previous permission id command
- that `/proc` directory shows kernal virtual filesystem on Linux. On mac you
  can look at `vmmap`. Get data from the kernal about running processes. Keep in
  mind that it __looks__ like its files on your disk, but its just an illusion
  by the OS so that you can do cool stuff with it like piping, etc.
- So `ls /proc` isn't an actual directory on your disk. It's the running
  processes that are just displayed as virtual files by your OS.
---
- Need to prevent a program from going out of bounds in memory:
  - Make a register, like `$bounds`, and if the CPU gets an address > bounds, the
  Program counter will get to some illegal memory access program.
- Historically, at some point people needed to run multiple programs at once.
  Primitive form of multitasking.
  - So, you'll have a `$base` register and a `$bounds` register, so you can't
    write less than `$base` or more than `$bounds`. You'll also want to make
    sure programs don't need to know in memory where they are, you want programs
    to know nothing about the actual memory numbers.
  - So, just use offsets so that programs don't need to know their memory, just
    apply the offsets to the memory address the programs are accessing.
- The above approach has the problem, because addresses need to be contiguous
  for the stack and heap. There become fragments in memory. You can't just move
  around and defragment all the programs in memory.
- Also there are common libraries that you might want programs to share.
- "orthagonal`?
- So you can't address those above problems with $base and $bounds system
  registers
- Need to have a hardware way to prevent accessing wrong regions of memory since
  you might not know register values at runtime.
- We want process to be able to share shared libraries. Mmap will share memory.

### Segmentation approach
- Entire process doesn't need to have a single contiguous address space, we'll
  have segments that can map to a process' address space. N bases and N bounds.

### Paging approach
- We'll keep track with a table. The page table. Solves external fragmentation.
- 4kb pages. But we should encourage our team to switch to larger page sizes!
- Swap is a trick that will save some memory to disk.
- In the program, your address space is linear. But under the hood, the virtual
  address maps to a completely different physical page number in memory.
- Translation causes the problem of being slow. The solution there is caching.
  The problem there is complexity 😅.
- Why are some things way slower than other?
  - Page table might have 1 million translations per process. OS has to store
    all of those in memory. Need to make the CPU lookup on the table as fast and
    simple as possible. But you can't put it all in one page table since there
    are millions per process and it wouldn't fit in memory for a 32 bit address space.
      - multi level page tables. Modern OSs have 4 layers (intel calls in PML4). Page tables pointing
        to page tables that eventually leads to a physical mapping. It's a
        compression technique because some addresses won't be used and won't
        point to other page tables. Tree based system for lookup mappings.
      - You might have to do up to 4 trips to RAM to get a translation, and then
        one more to actually get the physical address. 5x the time for this
        process to access RAM.
      - So, a modern system will have a TLB, a cache of translations, per CPU
        core. Independent threads will have their own TLB. For a given virtual
        address, you might have the data in the cache so you don't need to
        actually translate it. Want to just cache the translations.
      - 4k pages are WAY TOO SMALL. Tons and tons of records and you'll get
        cache misses. When the program first starts there will be nothing in the
        cache, every 4kb. TLB miss every 4kb! With shared addresses and threads
        you'll get synchronous update "TLB shootdown".
- So, we have shared memory, we don't have fragmentation, but it's just complex
  now by setting up all the page tables.
- Cache just caches surrounding data when you ask for an address.
  - Linked lists are no good!
  - need memory near by. Small sizes of things. 4 bit quantization of nueral
    nets.
  - "Open addressing" for hash tables is much better for caching. But
    traditionally we've done "chaining".
  - Hash maps can be costly. But open addressing helps that.
  - Examine cache usage: `perf` exposes hardware counters. Need bare metal
    access. "Cache grind": give me certain numbers for the sizes of your caches
    and I'll tell you what hit and miss rate is.
- Web devs think about millis, not nanos. TLB misses are nano (seconds) and can
  add up. Put a pin in this until you get to this order of magnitude work.

## File Systems
- everything is a file (?)
- file system was invented.
- segment of data is a block. Block size is 4k.
- Much like memory, it's laid out in units bigger than bits.
- blocks laid out all over the place.
- We want a file to seem contiguous to a program, not blocks that were random
  all over the place.
- Very few things do direct block access, even Postgres goes through the file
  system. Maybe some high performance data base does direct block access.
- File by file virtualization, just like Virtual memory. CPU has nothing to do
  with file system.
- Don't need CPU to do translations like for virtual memory because the disk is
  already so slow you won't see much performance improvement from getting the
  CPU involved.
- OS actually maintains the mapping for which file goes to which blocks. But you
  need to have a source on disk that is source of truth so that the block to
  file mapping persists after turning off the machine.
    - that mapping on disk is called the **inode**
    - inode keeps a number as well as the *blocks* that store the file. Since
      block sizes are fixed, that's all the OS needs to read a file and find the
      blocks for the file.
    - inode also stores permissions info, etc.
    - When to use an offset instead of starting at the beginning of a file?
      Watching a video from the middle. Or opening a file from the middle, if
      the file is really big, so you don't have to crash your system by opening
      the whole file in memory.
    - `man lseek`. OS maintains for any open file, the position, the offset, that it's
      currently at.
    - Vim calls `lseek` when jumping around in a file. Or scrubbing around in a
      file. If you search in vim, however, the file will all get loaded into
      memory. OS keeps recently read blocks in a cache.
    - If you ask to read 6k, it will read 2 blocks, and 8k will be fetched, but
      another read from that block will come from RAM, rather than disk, since
      it was cached.
- File systems are used much more than direct block access.
- What if a block changed on disk and it was cached in RAM? You need to set up
  file locks yourself — kernal won't do it for you. So RAM will just get cached
- Writes are buffered to disk. But you can force them with fsync. If you
  definitely want the thing on disk. Postgres writes, and then fsync so you
  guarantee that transaction. If the transaction succeeds, you know the file was
  written on disk. There was a Postgres issue where they weren't fsyncing
  directories so they were losing data.
  - You need to fsync yourself if you really want that.
  - "flush" is user space to kernal, "sync" is kernal to disk.
- "What every programmer should know about memory" by Ulrich Drepper
  - He implemented the virtual memory substructure in Linux

## What is a directory?
- Just an invention of Ken Thompson.
- Heirarchical organization.
- Directory also has inodes!
  - **but the contents aren't blocks, they are links: `[name, inode #]`.**
  - `/a/b/c.txt`. OS will look at inode for `/`, looks for name `a`, then looks
    at inode for `a`, figure out where `a`'s data blocks are. Hopefully there's
    a `b`, read the inode, find the data blocks. **This is where the names of
    files come from! Names aren't store in inodes. They come from directories!**
  - Name and inode pair needs to get synced to disk!
  - If you link `ln`, the inode will be the same. If you `rm` the first file, it
    the linked file will still exist referencing the original inode. **Hard
    links!**
  - `stat -x <filename>` on OSX for nice output
  - `ln -s foo bar`. Symbolic link. Won't be relying on inodes, so you can link
    not relying on the inode, but this is very fragile.
      - so a symbolic link just literally makes a new inode, whose data contents
        are the path to the original file. And it'll make a new directory entry
        for the sym link.
- How are `.` and `..` implemented? **They're just links.** So, `stat ..` works!
  When you create a new directory. it'll make links for `.` and `..`.
- inodes store data blocks?
- directories are special file type where entries are ..
- `mv` is just a rename. Moving to another device is actually a "copy".
- If you delete a file, it still exists. IF you really want it to be gone, you
  need to write junk data over and over ontop of it. Disk controller won't let
  you just zero out the disk.
- does the disk controller have an OS?