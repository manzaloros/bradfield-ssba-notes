#include <stdio.h>

main()
{
				int c;

				// assign c and evaluate expression
				while ((c = getchar()) != EOF) {
								// if c has any blanks, output only one blank
								if (c == ' ') {
												putchar(' ');
												while ((c = getchar()) == ' ') ;
								} 
								if (c != EOF)
												putchar(c);
// todo: 1.10

				}
}
