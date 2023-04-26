# Virtual Machines and Containers

- Container should have a limited view of outside environment

## Structs, dot and arrow operators

```
// declares a type of struct
struct foo {
  int a;
}

// declares a variable s of type foo
struct foo s;
s.x = 42;

// ...

// declaring pointer to struct type
struct s *p = malloc(sizeof(struct foo));
p->x = 42;
// above line same as:
// (*p).x = 42;
```

- Struct is collection of related variables.
- Memory is allocated contiguously and members are allocated consecutively
- A variable, like `s` assigned to a struct, points to the first byte of the
  struct in memory
- Access the members of the struct with the `.` operator. Like `s.foo = 10`,
  etc.
- with `struct my_struct *p = malloc(sizeof(struct my_struct));`, `p` is a
  pointer to a struct of type `my_struct`.
- `p` points to the first byte of the allocated memory block on the heap.
- Allocating a struct with `malloc(sizeof(some_struct))` is useful to
  dynamically set aside memory for the struct if we don't know the size of it's
  members at compile time. You have to call `free()` later to free up the
  memory. So this memory allocation is done at **run time**.
- But if you declare the struct with `struct foo s`, the memory will be
  automatically freed when the program goes out of scope. This allocation is
  done at **compile time** on the stack.
- Pointer to struct type (`p` in the above example) stores memory address of the
  instance of the struct type. You can indirectly reference the struct instance
  by dereferencing the pointer (with `*p`). Memory is only allocated for the
  pointer variable itself.
- Variable of struct type (`s` in the above example) consists of consecutive
  memory locations. The size of `s` in the actual size of each member added
  together. So if it had two `int` members

- `struct child_config config = {0};` declares a variable `config` of type
  `child_config` and initializes all its members to `0`. The `{0}` is shorthand
  for initializing all members of a struct to 0.

## C main() program

- argc: count of arguments. Sometimes you will use this as `argc - 1` to skip
  the first argument, which is always the name of the program itself.
- argv: array of strings of arguments. First element of argv is always the name
  of the program itself.

## Clone() and namespaces

- Make sure to put `()` around flags and combine them with bitwise OR, not AND.
- Must call the program with `sudo` because only the root is able to create new
  network interfaces.
- Add `CLONE_NEWUSER` to create a new user namespace
- `chroot` pronounced "chur-root".
- launch a new shell with `/bin/bash`

## Control Groups
- Grouping processes with the same permissions together
- Limit the number of processes that can be created within the container.
  - Update the current process in the cgroup.procs file
  - Updated `pids.max` value
- Get current PID: `echo $$`
- Start multiple processes at once: `something & somethingElse & ...`, etc.
- Implement restrictions on:
  - memory
  - CPU shares
  - file descriptors