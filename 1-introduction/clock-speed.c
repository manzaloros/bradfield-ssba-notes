#include <sys/time.h>
#include <time.h>
#include <stdio.h>

/*
	Take start time - stop time.

	Divide by 1,000,000 (CLOCKS_PER_SEC on a 32 bit system), this gives you total seconds taken for
	the operation

	Take number of iterations / total seconds to give you the number of operations
	per second.

	Print the number of operations per second / number of iterations as the speed
	of your CPU
 */
int main()
{
	int result;
	int foo = 1;
	int bar = 2;
	int n = 1000000000;

	clock_t start = clock();
	for (int i = 0; i < n; ++i)
		result = foo + bar;
	clock_t stop = clock();
	float totalTimeTakenByCPU = (float)(stop - start) / CLOCKS_PER_SEC; // in seconds
	float operationsPerSecond = n / totalTimeTakenByCPU;

	printf("Clock speed is approximately %.3f GHZ\n", operationsPerSecond / n);

	return 0;
}

// result = foo + bar, .429 or 0.439 GHz.
// result = foo * bar, .480
// result = foo * bar, .443

// Gigahertz = billion cycles per second