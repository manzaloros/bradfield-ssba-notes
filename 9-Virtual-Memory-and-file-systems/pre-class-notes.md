# Virtual memory and file systems

- `otool <file> -xvV` to print disassembly
- What's the page size of my machine?
  - using `getconf PAGESIZE` you get `4096` so
    2^12.
- Approximate size of page table in bytes from size of programs running right
  now.
  - Largest program is WindowServer, but next largest is Java at 700MB.
- What happens when a program consumes more and more memory predictably?
  - memory starts to 0 out?
- What would be the tradeoffs of quadrupling my OS page size?
  - more virtual memory for processes, but less processes available to run.

## opening files
- `dtruss` traces which system calls a program makes
- Every running process already has 3 files open: std input(file descriptor 0),
  std output(1), and std error (2).
  - So, if you open another file, it will have file descriptor 3.
- `read(file descriptor to read, buffer where the result of read() will be
  placed, size of buffer): number of bytes it read`.
- every process maintains an array of file descriptors, each refers to an entry
  in system wide *open file table*. Each entry in the open file table tracks
  which underlying file the descriptor refers to, the current offset, and other
  details like if the file is readable or writeable.
- `lseek` reposition read/write file offset. (read or write to a specific offset
  within a file). It simply changes a variable in OS memory that tracks for a
  particular process at which offset its next read or write will start.
- OFT (open file table)
- OS keeps track for each process the current offsets its at for a file to make
  reading and writing simpler.
- File descriptor : entry in open file table. 1:1 mapping. Even if you're
  reading the same file multiple times, each read will have it's own entry.
- Parent process can make a child with `fork()`. This will __share a file table
  entry between the parent and child, including the offset__. When an FD is
  shared, it's reference count is incremented. Using this sharing a parent and
  child can cooperatively write to the same output file.
- Are system calls in UNix written in C?
- `dup()` will let a process create a new file descriptor that refers to the
  same underlying open file as an existing FD.
- `write()`: please write this file to persistent storage. The file system will
  buffer writes in memory for like 5-30 seconds.
- `fsync()` will **FORCE** a write to disk, like a database that needs a
  guaranteed write will need. "dirty data": not yet written data.
- Memory mapping: `mmap()`. I don't understand this yet, but It's another way to
  access persistent data in files.

## Renaming a file
- `mv` command. calls the `rename()` system call. `rename()` is an *atomic*
  call, if there's a crash your file is either the old name or the new name.
  There's no inbetween state.
- `stat` gives you metadata about a file. Remember on Mac that some commands
  give ugly non formatted output as opposed to Linux.
- `inode` stores metadata information. It's a persistent data structure kept by
  the file system that has information like the metadata `stat()` output. All
  inodes are on disk and active ones are copied into a cache in memory to speed
  access.

## Removing a file
- `rm` calls `unlink` under the hook. Check this out with `dtruss`.

## Making Directories
- You can't write to a directory directly because format of dirctory is
  considered file system metadata. So you can only update a directory indirectly
  by creating files, directories or other objects within it.