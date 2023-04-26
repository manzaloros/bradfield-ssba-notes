#include <stdlib.h>
#include <stdio.h>
#include <math.h>

// int *foo()
// {
//   // this doesn't work because local variables are stored on the stack!
//   // need to call malloc
//   // int nested[1000];
//   // int i;

//   // for (i = 0; i < 1000000000; i++)
//   // {
//   //   nested[i] = 0;
//   // }
//   // return nested;
// }

#define BIG 1000000

int main()
{

  int i;
  int *array[BIG];

  for (i = 0; i < BIG; i++)
  {
    printf("%p\n result:", malloc(pow(i, 4)));
  }

  return 0;
}
