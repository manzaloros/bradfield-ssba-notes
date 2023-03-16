#include <stdio.h>

#define LOWER 0
#define UPPER 300
#define STEP 20

/* print Fahrenheit-Celcius table
 * for fahr = 0, 20, ..., 300 */
main()
{
	//float fahr, celcius;
	//float lower, upper, step;

	//lower = 0; /* lower limit of temp scale */
	//upper = 300; /* upper limit of scale */
	//step = 20; /* step size */
	//fahr = lower;
	//printf("%3s %10s\n", "Fahrenheit", "Celcius");
	//while (fahr <= upper) {
	//	celcius = (5.0/9.0) * (fahr - 32.0);
	//	printf("%3.0f \t \t %6.1f\n", fahr, celcius);
	//	fahr = fahr + step;
	//}
	
	int fahr;
	for (fahr = UPPER; fahr >= LOWER; fahr = fahr - STEP) {
		printf("%3d %6.1f\n", fahr, (5.0/9.0)*(fahr - 32));
	}
}
