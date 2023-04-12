#include <stdio.h>
#include <stdlib.h>
#include <assert.h>

// the two types of objects allowed in our language
typedef enum
{
  OBJ_INT,
  OJB_PAIR
} ObjectType;

typedef struct sObject
{
  // mark if object is reachable
  unsigned char marked;
  // next object in list of all objects
  struct sObject *next;

  ObjectType type;

  union
  {
    int value;

    struct
    {
      struct sObject *head;
      struct sObject *tail;
    };
  };
} Object;

// Virtual machine
#define STACK_MAX 256

typedef struct
{
  // keep track of how many objects we've created
  int numObjects;

  // number of objects needed to trigger a garbage collection
  int maxObjects;

  // keep track of head of linked list of objects
  Object *firstObject;

  Object *stack[STACK_MAX];
  int stackSize;
} VM;

// smaller number is conservative with memory, larger number spends less time
// garbage collecting
#define INITIAL_GC_THRESHOLD 2;

VM *newVM()
{
  VM *vm = malloc(sizeof(VM));
  vm->stackSize = 0;
  vm->numObjects = 0;
  vm->maxObjects = INITIAL_GC_THRESHOLD;

  return vm;
}

// Pushes an object pointer to the stack
void push(VM *vm, Object *value)
{
  assert(vm->stackSize < STACK_MAX);
  printf("Stack overflow!");

  vm->stack[vm->stackSize++] = value;
}

// Pops an object pointer from the stack and returns it
Object *pop(VM *vm)
{
  assert(vm->stackSize > 0);
  printf("Stack underflow");

  return vm->stack[--vm->stackSize];
}

// Allocates memory on the heap for a new object, sets the object as unmarked, sets and returns a pointer to that
// object on the heap
Object *newObject(VM *vm, ObjectType type)
{
  Object *object = malloc(sizeof(Object));
  object->type = type;
  object->marked = 0;

  object->next = vm->firstObject; // set the next object of the list the previous first object
  vm->firstObject = object;       // make this the first object of the list of all objects in the VM

  vm->numObjects++;
  return object;
}

// Makes and pushes a new int object to the heap
void pushInt(VM *vm, int intValue)
{
  Object *object = newObject(vm, OBJ_INT);
  object->value = intValue;

  push(vm, object);
}

// Makes and pushes a new pair object to the heap. Why do we have to set the
// tail and head to values popped from the stack?
Object *pushPair(VM *vm)
{
  Object *object = newObject(vm, OJB_PAIR);
  object->tail = pop(vm);
  object->head = pop(vm);

  push(vm, object);
  return object;
}

void mark(Object *object)
{
  // avoid cycles
  if (object->marked)
    return;

  object->marked = 1;

  if (object->type == OJB_PAIR)
  {
    mark(object->head);
    mark(object->tail);
  }
}

void markAll(VM *vm)
{
  for (int i = 0; i < vm->stackSize; i++)
  {
    mark(vm->stack[i]);
  }
}

// Visit every single object in the VM's linked list of objects. If the object
// hasn't been marked, it's unreachable, so free the space up in the heap.
// Otherwise, mark the object as unmarked and visit the next object in the chain.
void sweep(VM *vm)
{
  Object **object = &vm->firstObject;
  while (*object)
  {
    if (!(*object)->marked)
    {
      Object *unreached = *object;

      *object = unreached->next;
      free(unreached);
      vm->numObjects--;
    }
    else
    {
      (*object)->marked = 0;
      object = &(*object)->next;
    }
  }
}

// Visit all objects and free up the space in the heap of objects that aren't currently in
// use by the VM. Since we decrement the number of objects in use each time we
// free up space, we also double the max object threshold after freeing up the
// space based on the number of objects actually in use. This doubling has the
// effect of triggering the garbage collection later on as the heap grows bigger.
void gc(VM *vm)
{
  int numObjects = vm->numObjects;

  markAll(vm);
  sweep(vm);

  vm->maxObjects = vm->numObjects * 2;
}

int main()
{
  VM *vm = newVM();

  pushInt(vm, 5);
  pushPair(vm);

  gc(vm);
}