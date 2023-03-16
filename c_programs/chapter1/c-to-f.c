#include <stdio.h>
/*
 * print celcius to fahr table
 * */
main()
{
	float celcius, fahr;
	float lower, upper, step;

	lower = 0;
	upper = 50;
	step = 5;

	celcius = lower;
	while (celcius <= upper) {
		fahr = celcius / (5.0 / 9.0) + 32;
		printf("%3.0f %6.1f\n", celcius, fahr);
		celcius = celcius + step;
	}
}
