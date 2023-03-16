#include <stdio.h>

/* count lines to input */

main() 
{
				int c, nl, t, b;

				nl = 0;
				while ((c = getchar()) != EOF) {
								if (c == '\n') ++nl;
								if (c == '\t') ++t;
							  if (c == ' ')	++b;
				}
				printf("%d\n", nl);
}

