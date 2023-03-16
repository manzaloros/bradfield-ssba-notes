#include <stdio.h>

main()
{
				// for each character of input, while char isn't EOF
				// if the char is one of the whitespace chars
				// replace it with the string representation of the whitespace

				for (int c; (c = getchar()) != EOF;) {
								if (c == '\\') {
												// print a single backslash, via escaping it
												putchar('\\');
												// set c to be a single backslash
												c = '\\';
								}
								else if (c == '\t') {
												putchar('\\');
												c = 't';
								}
								else if (c == '\b') {
												putchar('\\');
												c = 'b';
								}
								// prints c. Will be the c set in an if statement earlier if the input char was an invisible char.
								putchar(c);
				}
}
