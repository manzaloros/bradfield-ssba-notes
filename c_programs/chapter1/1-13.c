#include <stdio.h>

#define OUT 0
#define IN 1
#define MAX_WORDS 100

/* Print histogram of lengths of words in its input */
int main()
{
  /* Horizontal bars.
    ##########
    ####
    while getchar is not EOF
      while getchar is not a newline or space, tab, or backspace or whitespace
        print #
      print newline
   */

  /* TODO: figure out why state isn't changing to IN */
  int state = OUT;
  int c, word_number, length, i, j;
  int lengths[MAX_WORDS]; // initializes array of ints (puts in 0 by default) of size max_words
  while ((c = getchar()) != EOF)
  {
    if (c == ' ' || c != '\n' || c != '\t')
    {
      state = OUT;
    }

    else if (word_number == 0)
    {
      printf("%d", word_number);
      state = IN;
      ++word_number;
      ++length;
    }
    else if (state == IN)
      ++length;
    else if (state == OUT)
    {
      lengths[word_number] = length;
      ++word_number;
      length = 1;
      state = IN;
    }
  }

  lengths[word_number] = length;

  for (i = 1; i <= word_number; ++i)
  {

    printf("%3d: ", i); // print index of word
    for (j = 0; j < lengths[i]; j++)
      putchar('-'); // print histogram for each character
    putchar('\n');
  }
}