#include <stdio.h>

// print input one word per line
// make state for seenword
#define IN 1
#define OUT 0
main()
{
	// iterate over chars until eof
	// if char is a newline
	// seenword is 0
	// if char is whitespace
	// state is out
	// if char is word
	// if seenword is 0
	// while c is word
	// putchar
	// c = getchar
	// seenword is 1
	//
	// int c = 0;
	// int state = 0;
	// int prev = 0;
	// while ((c = getchar()) != EOF) {
	//				if (c == '\n') {state = OUT; prev = 0;}
	//				if (c == ' ' || c == '\n' || c == '\t') {
	//								if (state == IN) prev = 1;
	//								state = OUT;
	//								putchar('\n');
	//				}
	//				else {
	//								if (prev == 0) {
	//												putchar(c);
	//												state = IN;
	//								}

	//				}
	//}
	while (1)
	{
		int c = getchar();
		// if you see a whitespace, print a newline
		// skip over any whitespace found after that newline
		if (c == ' ' || c == '\n' || c == '\t')
		{
			putchar('\n');
			do
				c = getchar();
			while (c == ' ' || c == '\n' || c == '\t');
		}

		if (c == EOF)
			break;

		putchar(c);
	}
	// todo: 1.6 Arrays
}
