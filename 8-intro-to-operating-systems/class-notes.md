# Introduction to Operating Systems

- What's missing from the model, if we know about fetch-decode-execute?
  - Switching between running tasks
  - prioritizing tasks
  - have certain permissions for users
- What happens when you turn on the machine?
  - Program counter set to "reset vector"
  - stored instructions for a bootloading process, exetremely basic.
  - check that things aren't broken.
  - Will look for an operating system
  - Bios is basic input output
  - Recovery mode on mac, before OS
  - Launches kernal that sets up data structurse
  - Eventually the kernal hands over to user processes, like `launchd` or
    `systemd`, etc. Every user process is a child of that process.
- Processes by definition run in their own address space.
- How does a process stop running temporarily? How does control go away from the
  user process?
- To create a new process that doesn't replace existing Bash process, bash will
  call `fork`. Fork creates new process. Only separated from `exec` so you could
  have time to pipe from `fork`?
- `exec`
- The Rise of Worse is Better
- `man 2 exec`, section 2 (system calls) of the manual. Each section has different things. C
  standard library section, etc.
- `pstree`, or `pstree -p`
  **- What happens when you press enter on a Bash shell command?**
  - `fork` | `exec` is called (?)
- parent of function is bash, parent of bash is systemd
- pthreads (POSIX threads), POSIX is unix-like OSes
- difference between process and threads, processes run in their own address
  space
- `task` or `proc` struct. Stores details on processes, like id.
- `ps aux` check out `stat` column. Shows you process states. `R` means it's
  part of the `run` queue and could be scheduled
- `sleep` will tell OS not to schedule process for some amount of time
- `time`, real is clock time. User is how much time is spent in user space. sys
  is how much time is spent in OS space.
- `control-C` is a software interupt.
- timer interupt. After some amount of time, the PC will be replaced by
  something that gives the kernal control. Controlled entry point to the kernal
  at a fixed address in memory.
- Interupt can be called a trap
- segmentation fault, trying to access the wrong part of memory. The kernal is
  given control in this situation.
- Trap table, CPU reads it to see if a specific trap has been encountered
- Bootloader lives on ROM (read only)
- What is a Race condition?
- Exceptional control flow.
- `man signal`, control-C sends sigint (interupt)
- `stty -a`
- kernal has a signal handler
- scheduler also has it's own stack
- control-D does NOT send a segnal. Sends EOF byte value to stdio. ASCII value
- If you close terminal tab it will kill child bash process because it kills
  parent process
- control-Z
- `man 3 printf` for c standard library
- printf doesn't make system call all the time. It runs in user space in a
  buffer. Writes characters until a line-feed (\n). Doesn't flush all the time.
- `fflush` explicitly flush
- ken thompson created unix
- teletypwriter. Electric typewriter with a telephone connection to the PDP 11.
- terminal line etiquite comes from this physical connection
- `man termios`
- timer interupt needs to get the kernal back onto the CPU
- windows 3.1 didn't support hardward interupts. Programs had to voluntarily
  yeield control back to the kernal. Cooperative multitasking, but this is now
  antiquated because modern system ship with a timer interupt.
- Docker on Mac runs by running the container on a linux VM on mac, container is
  NOT native to mac
- the kernal is the code behind the system call interface
- OS is all code packaged with the tools
- `man unlink`. `rm` invokes the system call `unlink`.
- `stat foo`
- `ln foo bar` link bar to foo.
- `mount`
