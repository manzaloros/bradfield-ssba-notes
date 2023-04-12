#include <stdio.h>
#include <signal.h>

int myvar = 2000;

int handler(int sig)
{
	printf("%s\n", "in handler");
	return 0;
}

// invoke this and try to control-C
int main(int argc)
{
	signal(SIGINT, handler);
	printf("hello %s\n");
	while (1)
		;
}
