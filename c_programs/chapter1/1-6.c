#include <stdio.h>
// EOF is -1
/* copy input to output */
main() {
  int c;

	while ((c = getchar()) != EOF) {
		printf("%d", getchar() != EOF); 
		printf("%d", EOF != EOF); 
		putchar(c);
	}
	//Todo: 1.5.2
}
