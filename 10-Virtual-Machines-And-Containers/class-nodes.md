# Virtual Machines and Containers

- virtual machines and containers aren't totally related but are often conflated
- What are the big ideas with both?
- What are the differences between them and what they do and solve?
- What are the downsides using one or the other
- What are the high level details of how either works?

## Virtual Machines

- What's the point of virtual machines?
  - Run multiple operating systems on one machine
  - Decouple hardware from operating system
  - Serving software more through web applications and less through box software
  - Amazon doesn't sell box software.
    - they're serving software off a fleet of machines.
    - Infrastructure as a service. EC2.
    - This is where they started this major business model.
    - Customers pay for share of resources
    - Containers aren't a paradigm for co-tenancy?
    - Basically Amazon wants you to be able to install any operating system you
      want on EC2
  - One machine could have like 10 operating systems
  - All those operating systems share
    - CPU
    - RAM
    - I/O (one physical ethernet cable for all the OSs)
  - OSs cannot be aware of one another. Not permissable.
  - Limited Direct Execution
    - when something's running, it's running. Not interpreted, but:
    - it's limited because we have modes, like user mode and system mode
    - Context switching, switch between process 1 and 2, save registers of
      process 1 and load the registers of process 2.
    - Scheduler: deciding which process should go next
    - Timing interupt, so even if process isn't yielding, the hardware can give
      control back to the OS
  - To extend Limited direct execution to VMs
    - Virtual Machine Monitor, the hypervisor, is booted into when the machine turns on.
    - timer interupt is handled by this VMM. Hypervisor makes a scheduling decision.
    - Instead of a "context" switch, it's called a "machine switch". Save all
      the register values. Saved to the stack, usually.
    - Simplest scheduling logic: when timer goes off, round robin, give control
      to OS 1, then after the next timer, give control to OS 2. (restoring state
      each time)
    - Each OS has it's own scheduler
  - Is this secure? VMMs?
    - They are as secure as each OS is.
  - KVM, Xen. Both types of hypervisors?
- VMWare isn't considered a dominant company these days but it is a big company
  - came from a research project at Stanford
- How do we share RAM in VMs?
  - Each OS has page tables that makes each process think that they have their
    own address space
  - Then, you have two OSs doing the same thing with page tables
  - You have "machine memory", the real physical memory, and the hypervisor
    makes mappings from physical pages of each OS to machine memory.
    Virtualization of physical memory
  - Are there two layers of cache TLB?
    - Have a single TLB but with multiple page tables
    - TLB stores translation all the way from virtual to machine memory, tagged
      by which OS is running. So there's a tag for each memory location for
      whichever OS is running so you don't mix/match OSs and machine mappings.
    - Second Layer Address Translation. Extended Page Tables.
- Mac has it's own hypervisor framework that Virtual Box utilizes. Mac OS uses
  the hypervisor to load the guest OS, which the default is Mac OS!
- Network
  - Guest OSs do not need to feel like they are sharing packets with other OSs
- Persistent Storage
  - 3 modes: user, kernal, hypervisor
  - Virtual Machine Extensions
  - Trap to hypervisor caused by system Read call
  - When read comes back, the OS is let known that the read completed by the
    hypervisor.
  - I/O operation mediated both on the way AND on the way back to each OS. That's the
    most secure.
  - Used to be just the kernal mediating, but now the hypervisor is also an
    added mediator
  - I/O operation overhead is doubled versus running on the OS without a
    hypervisor
  - Are there 2 layers of file system mappings? No because the hypervisor just
    needs to provide a simple block abstraction.
  - Remember that kernal buffers write operations in blocks to wait to sync. The
    hypervisor doesn't do that.
  - Elastic block storage? Storage over a fleet of machines
- Nitro:
  - Amazon trying to reduce overhead of VMs.
    - both hypervisor (KVM derivative) and custom hardware (nitro cards) with
      network interface controlller and disk controller.
    - closed gap on performance cost
- **VMs not going anywhere anytime soon since performance gap is closed!**
- VMs nowadays don't need to trick guests nowadays, kernal writers now know
  their OS is often run on a hypervisor so they can take advantage of the
  hypervisor.
- Instead of making "system" calls, you'll now make "hyper" calls
- paravirtualization

## Containers

- Only runs on Linux.
- Bunch of processes on one machine can be isolated from each other.
- One process will have a view of the file system that is totally different than
  another process.
- `chroot`. Cheroot.
- `pivot_root` is more modern version.
- Overlaying mounts is the newest modern version.
- Namespaces group permissions together. Isolating namespaces.
- Containers are a mess
- When you clone, you can pass a namespace flag.
  - Linux now uses `clone` rather than `fork`
- Control groups
  - don't want memory leak of one process to affect another process
  - Or CPU
  - `man 7` very descriptive
  - failure needs to be proximate to the issue. Localized failure.
- Capabilities
  - only give the contained process certain privelages
  - can it send a signal? Can it make a system call?
  - sudo. Soo-doo?
  - docker runtime capabilities
- some container runtimes will disable certain system calls
- `runc` would be a solution to the exercise
- SELinux and AppArmor. OS limits what process can do at the project level. Way
  of extending Linux for container security.
- Improvised nature of containers
  - Secure? Convuluted. Not even a single model.
- Containers haven't broken too badly in recent times, so they've just become
  more resilient over time due to all the patches.
  - So it's still understandable why people would worry about container security
- Docker on Mac is run via Linux in a VM running Linux. Container -> VM -> Mac
  - One more turtle

## Misc

- Sidechannel attack? Security flaw with hardware.
- Specter meltdown? Need to turn off speculative execution to totally prevent
  this. Turns off branching shared cache speculative execution? Branch
  predictors. Huge performance impact by turning this off, though.
